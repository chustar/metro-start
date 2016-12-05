/* jshint node: true */

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webpack: {
            all: {
                entry: './js/app.js',
                output: {
                    filename: 'bundle.js',
                    path: './dist',
                    sourceMapFileName: 'bundle.map'
                },
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                resolve: {
                    alias: {
                        jss: '../../node_modules/jss/jss.js'
                    }
                },

                // Source map option. Eval provides a little less info, but is faster
                // Our loader configuration
                loaders: [
                    { test: /\.pug$/, loader: 'pug-static' }
                ],

                pug: {
                    pretty: false,
                },

                plugins: [
                    new CopyWebpackPlugin([
                        { from: 'css', to: 'css' },
                        { from: 'icons', to: 'icons' },
                        { from: 'manifest.json' },
                    ]),

                    new HtmlWebpackPlugin({
                        filename: 'start.html',
                        template: 'pug-static!start.pug'
                    })]
            }
        },
        jshint: {
            all: [
                "js/**/*.js"
            ]
        },
        watch: {
            scripts: {
                files: [
                    'js/**/*.js',
                ],
                tasks: ['test'],
                options: {
                    spawn: false,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['webpack']);
    grunt.registerTask('test', ['webpack', 'jshint']);
    grunt.registerTask('default', ['webpack', 'test']);
};