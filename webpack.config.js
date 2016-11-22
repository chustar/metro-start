module.exports = {
    entry: './js/app.js',
    output: {
        filename: 'bundle.js',
        path: './dist',
        sourceMapFileName: 'bundle.map'
    },

resolve: {
    alias: {
        jss: '../../node_modules/jss/jss.js'
    }
},

    // Source map option. Eval provides a little less info, but is faster
    devtool: 'eval',
    // Our loader configuration
    module: {
        loaders: [{
            test: /\.html$/,
            loader: "mustache"
        }]
    }
}