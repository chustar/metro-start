define(['jquery', 'jss', 'utils/storage', 'pages/links', 'pages/apps', 'pages/bookmarks', 'pages/themes'],
function Pages(jquery, jss, storage, links, apps, bookmarks, themes) {
  var pages = {

    name: 'pages',

    elems: {},

    data: Array.prototype.slice.call(arguments, 3),

    forEachModule: function(func) {
      var thatArgs = arguments;
      this.data.forEach(function(module) {
        if (module[func]) {
          module[func].apply(module, Array.prototype.slice.call(thatArgs, 1));
        }
      });
    },

    init: function(document) {
      this.forEachModule('init', document, this.getPageItemCount());

      this.changePage(storage.get('page', 'links'));

      jquery(this.elems.chooser).metroSelect({
        'onchange': this.changePage.bind(this)
      });

      var that = this;
      jquery(window).bind('resize', this.windowResized.bind(this));
      this.windowResized();
    },

    changePage: function changePage(page) {
      this.page = page;
      if (page != 'themes') {
        storage.save('page', page);
      }

      this.elems.chooser = document.getElementById(this.name + '-chooser');
      jquery(this.elems.chooser).attr('selectedIndex', this.indexOfModule(this.page));
      jquery(this.elems.chooser).change();

      jss.set('.external .internal', {
        'margin-left': (this.indexOfModule(page) * -100) + '%'
      });
    },

    // Compare document height to element height to fine the number of elements per page.
    windowResized: function() {
      var height = this.getContentHeight();
      jss.set('.external', {
        'height': '' + height
      });
      jss.set('.bookmark_page', {
        'height': '' + height
      });

      var pageItemCount = this.getPageItemCount();
      this.forEachModule('setPageItemCount', pageItemCount);
    },

    getContentHeight: function() {
      var pageHeight = jquery('body').height();
      var headerHeight = jquery('h1').outerHeight(true);
      var navBarHeight = jquery('.' + this.name + '-chooser').outerHeight(true);
      var footerHeight = jquery('.footer').outerHeight(true);
      return pageHeight - (headerHeight + navBarHeight + footerHeight);
    },

    getPageItemCount: function() {
      return Math.floor((this.getContentHeight()) / 60);
    },

    showOptionsChanged: function(showOptions) {
      this.forEachModule('setShowOptions', showOptions);
    },

    indexOfModule: function indexOfModule(moduleName) {
      return this.data.map(function(m) { return m.name; }).indexOf(moduleName);
    }
  };

  return pages;
});
