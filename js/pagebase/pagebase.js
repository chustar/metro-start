define(['utils/util', 'utils/storage', 'metro-select'], function(util, storage, metroSelect) {

    var validPageBases = ['simple', 'grouped', 'paneled'];

    var templates = {
       column: util.createElement('<div class="page"></div>'),
       item: util.createElement('<div class="item"></div>')
    };

    var pagebase = function pagebase() {
    };

    // Callbacks
    pagebase.prototype.addAllNodes = function() {
      throw new "addAllNodes not implemented";
    }

    pagebase.prototype.init = function(document, name, rootNode, templateFunc) {
        this.elems = {};
        this.name = name;
        this.rootNode = rootNode;
        this.sort = storage.get(this.name + '_sort', false);
        this.currentPage = 0;
        this.templateFunc = templateFunc;
        this.page = 0;

        var that = this;
        var selector = $('#' + this.name + '-chooser');
        selector.attr('selectedIndex', this.sort ? 1 : 0);
        selector.metroSelect({
            'onchange': this.sortChanged.bind(this)
        });

        this.elems.internal_selector = document.getElementById('internal_selector_' + this.name);
    };

    pagebase.prototype.sortChanged = function sortChagned(sort) {
        this.sort = !this.sort;
        storage.save(this.name + '_sort', this.sort);
    };

    pagebase.prototype.compareFunc = function compareFunc(a, b) {
        return a.firstElementChild.textContent > b.firstElementChild.textContent;
    };

    pagebase.prototype.rebuildDom = function() {
        var nodes = [];
        this.currentPage = 0;

        while (this.rootNode.firstElementChild) {
            var column = this.rootNode.firstElementChild;
            while (column.firstElementChild) {
                nodes.push(column.firstElementChild);
                column.firstElementChild.remove();
            }
            column.remove();
        }
        this.addAllNodes(nodes);
    };

    pagebase.prototype.buildDom = function buildDom(rows) {
        this.currentPage = 0;
        while (this.rootNode.firstElementChild) {
            this.rootNode.firstElementChild.remove();
        }
        this.addAll(rows);
    };

    pagebase.prototype.addAll = function addAll(rows) {
        var nodes = [];
        for (var i = 0; i < rows.length; i++) {
            var item = templates.item.cloneNode(true);
            item.id = this.name + '_' + i;
            item.firstElementChild.id = this.name + '_' + i;
            item.firstElementChild.appendChild(this.templateFunc(rows[i], this.currentPage));
            nodes.push(item);
        }
        this.addAllNodes(nodes);
    };

    pagebase.prototype.getPages = function getPages() {
        return Array.prototype.slice.call(this.elems.internal_selector.children);
    };

    pagebase.prototype.addAllNodes = function addAllNodes(nodes) {
      throw "#notmyjob";
    };

    pagebase.prototype.setPageItemCount = function setPageItemCount(pageItemCount) {
        if (pageItemCount !== this.pageItemCount) {
            this.pageItemCount = Math.max(pageItemCount, 1);
            this.rebuildDom();
        }
    };

    pagebase.prototype.setShowOptions = function setShowOptions(showOptions) {
        this.showOptions = showOptions;
        this.rebuildDom();
    };

    pagebase.prototype.truncatePages = function truncatePages(pageNumber) {
        // var page_number = this.parentNode.id.remove('pages_');
        var nodes = Array.prototype.slice.call(this.elems.internal_selector.children);
        console.log(parseInt(pageNumber) + 1);
        nodes.splice(0, parseInt(pageNumber) + 1);
        nodes.forEach(function(node) {
            node.remove();
        });
    };

    return pagebase;
});
