const path = require('path');
const {version} = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const baseConfig = {
    entry: './es6/app.js',
    devtool: 'inline-source-map',
    mode: 'production',
    optimization: {
        minimize: false,
    },
    stats: {
        colors: true,
        modules: true,
        reasons: true,
    },
    resolve: {
        alias: {
            jquery: require.resolve('jquery'),
            jss: path.resolve(__dirname, './node_modules/jss/jss.min.js'),
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
};

const createConfig = (name, overrides = {}) => ({
    ...baseConfig,
    ...overrides,
});

const createCopyPatterns = (manifestTransform) => [
    {from: 'html/start.html'},
    {from: 'icons/*'},
    {
        from: 'manifest.template.json',
        to: 'manifest.json',
        transform: (content) => {
            const manifest = JSON.parse(content.toString());
            manifest.version = version;
            if (manifestTransform) {
                manifestTransform(manifest);
            }
            return JSON.stringify(manifest);
        },
    },
];

const chromeConfig = createConfig('chrome', {
    output: {
        filename: 'metro-start.js',
        chunkFilename: '[name].[contenthash].js',
        path: `${__dirname}/dist/chrome`,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
        },
        runtimeChunk: 'single',
    },
    plugins: [
        new CopyPlugin({patterns: createCopyPatterns()}),
        new ZipPlugin({
            path: `${__dirname}/dist`,
            filename: 'metro-start-chrome.zip',
        }),
    ],
});

const firefoxConfig = createConfig('firefox', {
    output: {
        filename: 'metro-start.js',
        path: `${__dirname}/dist/firefox`,
    },
    plugins: [
        new CopyPlugin({
            patterns: createCopyPatterns((manifest) => {
                manifest.manifest_version = 2;
                manifest.permissions.push(...(manifest.host_permissions || []));
                delete manifest.host_permissions;
                manifest.browser_specific_settings = {
                    gecko: {
                        id: 'metro-start@metro-start.com',
                        strict_min_version: '77.0',
                    },
                };
            }),
        }),
        new ZipPlugin({
            path: `${__dirname}/dist`,
            filename: 'metro-start-firefox.zip',
        }),
    ],
});

const xcodeConfig = createConfig('xcode', {
    output: {
        filename: 'metro-start.js',
        path: `${__dirname}/dist/xcode`,
    },
    plugins: [
        new CopyPlugin({patterns: createCopyPatterns()}),
        new ZipPlugin({
            path: `${__dirname}/dist`,
            filename: 'metro-start-xcode.zip',
        }),
    ],
});

module.exports = (env = {}) => {
    // Allow selecting a specific target via --env target=chrome|firefox|xcode|all
    const target = env.target || process.env.BUILD_TARGET || 'chrome';
    switch (target) {
        case 'chrome':
            return chromeConfig;
        case 'firefox':
            return firefoxConfig;
        case 'xcode':
            return xcodeConfig;
        case 'all':
            return [chromeConfig, firefoxConfig, xcodeConfig];
        default:
            return chromeConfig;
    }
};