require.config({
	paths: {
		'domReady': '../../lib/requirejs-domready/domReady',
		'jquery': '../../lib/jquery/dist/jquery',
		'jqueryUI': '../../lib/jquery-ui/ui/minified/jquery-ui.min',
		'jss': '../../lib/jss/jss',
		'metro-select': '../../lib/metro-select/metro-select',
	},
	shim: {
		metroSelect: ['metro-select'],
		jss: {
			deps: ['jquery'],
			exports: 'jss'
		}
	},
});

require(['app', 'utils/storage'], function(app, deferredStorage) {
	'use strict';

	deferredStorage.init().done(function(storage) {
		app.init();
	});
});
