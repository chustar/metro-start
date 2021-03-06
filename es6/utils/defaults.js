/**
The default theme for metro start.
*/
export default {
    init: function() {},

    // defaultFonts: ['system', 'raleway', 'source', 'wire one', 'im fell'],

    defaultFonts: [
        'raleway',
        'kurale',
        'wire one',
        'im fell english',
        'source serif pro',
        'monoton',
        'inconsolata',
    ],

    defaultWebservice: 'https://api.metro-start.com',

    defaultTodos: [{
        name: 'use the wrench to get started. . . ',
        done: false,
    }, ],

    // The default theme for the app.
    defaultTheme: {
        themeContent: {
            'font-chooser': 'system',
            'fontfamily-chooser': 'system',
            'fontweight-chooser': 'normal',
            'fontvariant-chooser': 'normal',
            'fontreadability-chooser': 'off',

            'palette-chooser': 'custom',
            baseColor: '#aaffaa',
            mainColor: '#ffffff',
            titleColor: '#4a4a4a',
            optionsColor: '#ff0000',
            backgroundColor: '#000000',

            'background-chooser': 'none',
            'trivariance-chooser': 'uniform',
            'trisize-chooser': 'medium',
            'tristyle-chooser': 'monochromatic',
        },
        title: 'metro start',
        author: 'metro start',
    },

    // The default sorting for pages.
    defaultSort: {
        todos: false,
        apps: false,
        bookmarks: false,
        themes: false,
    },

    // The default weather location.
    defaultWeather: {
        city: 'vancouver, ca',
        units: 'celsius',
        visible: true,
    },

    systemThemes: [{
        title: 'randomize',
        author: 'metro start',

        optionsColor: '#ff0000',
        mainColor: '#ffffff',
        titleColor: '#4a4a4a',
        backgroundColor: '#000000',

        online: true,
    }, {
        title: 'metro start',
        author: 'metro start',

        optionsColor: '#ff0000',
        mainColor: '#ffffff',
        titleColor: '#4a4a4a',
        backgroundColor: '#000000',

        online: true,
    }, ],
};
