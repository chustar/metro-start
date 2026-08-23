const path = require('path');
const packageJson = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const webpack = require('webpack');
const {transformManifest} = require('./scripts/manifest.cjs');

const config = {
    entry: './es6/app.js',
    devtool: false,
    mode: 'production',
    optimization: {
        minimize: true,
    },
    stats: {
        colors: true,
        preset: 'errors-warnings',
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

const createConfig = (target) => ({...config,
    output: {
        filename: 'metro-start.js',
        chunkFilename: `${target}.[name].[contenthash].js`,
        path: `${__dirname}/dist/${target}`,
        clean: true,
    },
    performance: {
        hints: false,
    },
    plugins: [
        ...(target === 'xcode'
            ? [new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})]
            : []),
        new CopyPlugin({
            patterns: [
                {from: 'html/start.html'},
                {from: 'icons/*' },
                {
                    from: 'manifest.template.json',
                    to: 'manifest.json',
                    transform(content) {
                        return transformManifest(
                            content,
                            packageJson.version,
                            target
                        );
                    }
                }]}),
        new ZipPlugin({
            path: `${__dirname}/dist`,
            filename: `metro-start-${target}.zip`,
        })]
});

const chromeConfig = createConfig('chrome');
const firefoxConfig = createConfig('firefox');
const xcodeConfig = createConfig('xcode');
    
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
