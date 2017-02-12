define(['../pagebase/pagebase','../utils/storage', '../utils/util'], function(pagebase, storage, util) {
    var apps = {
        name: 'apps',

        data: {},

        elems: {},

        templates: {
            titleFragment: util.createElement('<span class="title clickable"></span>'),
            uninstallFragment: util.createElement('<span class="option options-color small-text clickable">manage</span>')
        },

        // Initialize this module.
        init: function(document) {
            this.elems.rootNode = document.getElementById('internal_selector_apps');
            this.apps = new pagebase();
            this.apps.init(document, this.name, this.elems.rootNode, this.templateFunc.bind(this));
            this.loadApps();
        },

        sortChanged: function (newSort) {
            if (this.bookmarks.sortChanged)
            {
                this.bookmarks.sortChanged(newSort, false);
            }
        },

        // Loads the apps from Chrome app API.
        loadApps: function() {
            var that = this;
            chrome.management.getAll(function(res) {
                that.data = [];
                for (var i = 0; i < 25; i++) {
                    that.data.push({
                        'name': 'Chrome Webstore',
                        'appLaunchUrl': 'https://chrome.google.com/webstore'
                    });
                }

                // Remove extensions and limit to installed apps.
                that.data = that.data.concat(res.filter(function(item) { return item.isApp; }));
                that.apps.buildDom(that.data);
                that.apps.buildDom(that.data);
            });
        },

        // Sets whether options are currently showing.
        // showOptions: true, if options are now showing; false otherwise.
        setShowOptions: function setShowOptions(showOptions) {
            this.apps.setShowOptions(showOptions);
        },

        // Returns an HTML link node item.
        // item: The link item to be converted into a node.
        templateFunc: function(app) {
            var fragment = util.createElement('');
            var title = this.templates.titleFragment.cloneNode(true);
            title.firstElementChild.href = app.launchUrl;
            title.firstElementChild.textContent = app.name;
            fragment.appendChild(title);

            var manage = this.templates.uninstallFragment.cloneNode(true);
            manage.firstElementChild.addEventListener('click', this.manageApp.bind(this, app));
            fragment.appendChild(manage);

            return fragment;
        },

        // Uninistall an app from Chrome.
        // app: THe app to be uninstalled.
        manageApp: function(app) {
            var that = this;
            // chrome.management.uninstall(app.id, { showConfirmDialog: true}, function() {
            //     that.loadApps();
            // });
            
        }
    };

    return apps;
});
