const path = require('path');
const packageJson = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

const config = {
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
                    'css-loader'
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
    }
};

var chromeConfig = Object.assign({}, config, {
    output: {
        filename: 'metro-start.js',
        chunkFilename: 'chrome.[name].[contenthash].js',
        path: `${__dirname}/dist/chrome`,
    },
    optimization: Object.assign({}, config.optimization, {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20000,
        },
        // keep runtime separate so vendor splitting is effective
        runtimeChunk: 'single',
        // minify the chrome demo build to reduce bundle size
        minimize: true,
    }),
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: 'html/start.html'},
                {from: 'icons/*' },
                {
                    from: 'manifest.template.json',
                    to: 'manifest.json',
                    transform(content) {
                        let manifest = JSON.parse(content.toString());
                        manifest.version = packageJson.version;
                        return JSON.stringify(manifest);
                    }
                }]}),
        new ZipPlugin({
            path: `${__dirname}/dist`,
            filename: 'metro-start-chrome.zip',
        })]
});

var firefoxConfig = Object.assign({}, config, {
    output: {
        filename: 'metro-start.js',
        path: `${__dirname}/dist/firefox`,
    },
    plugins: [new CopyPlugin({
        patterns: [
            {from: 'html/start.html'},
            {from: 'icons/*' },
            {
                from: 'manifest.template.json',
                to: 'manifest.json',
                transform(content) {
                    let manifest = JSON.parse(content.toString());
                    manifest.version = packageJson.version;
                    manifest.manifest_version = 2;
                    manifest.browser_specific_settings = {
                        gecko: {
                            id: 'metro-start@metro-start.com',
                            strict_min_version: '77.0'
                        }
                    };
                    return JSON.stringify(manifest);
                }
            }]
    }),
    new ZipPlugin({
        path: `${__dirname}/dist`,
        filename: 'metro-start-firefox.zip',
    })]});

var xcodeConfig = Object.assign({}, config, {
    output: {
        filename: 'metro-start.js',
        path: `${__dirname}/dist/xcode`,
    },
    plugins: [new CopyPlugin({
        patterns: [
            {from: 'html/start.html'},
            {from: 'icons/*' },
            {
                from: 'manifest.template.json',
                to: 'manifest.json',
                transform(content) {
                    let manifest = JSON.parse(content.toString());
                    manifest.version = packageJson.version;
                    return JSON.stringify(manifest);
                }
            }]
    }),
    new ZipPlugin({
        path: `${__dirname}/dist`,
        filename: 'metro-start-xcode.zip',
    })]});
    
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
