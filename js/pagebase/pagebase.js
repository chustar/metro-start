define(['jquery', '../utils/util', '../utils/storage', '../utils/defaults', 'metro-select'], function(jquery, util, storage, defaults, metroSelect) {
    var templates = {
       item: util.createElement('<div class="item"></div>')
    };

    var pagebase = function pagebase() { };

    // Initialize the module.
    pagebase.prototype.init = function(document, name, rootNode, nameFunc, templateFunc) {
        this.elems = {};
        this.name = name;
        this.rootNode = rootNode;
        this.currentPage = 0;
        this.nameFunc = nameFunc;
        this.templateFunc = templateFunc;
        this.page = 0;

        jquery('#' + this.name + '-sort-chooser').metroSelect({
            initial: this.getSort(),
            onchange: this.sortChanged.bind(this)
        });

        // this.rootNode = document.getElementById('internal_selector_' + this.name);
    };

    // Ordering of elements on the page has changd.
    // sort: New sort order.
    // pagebase.prototype.sortChanged = function sortChagned(sort) {
    //     this.sort = !this.sort;
    //     storage.save(this.name + '_sort', this.sort);
    // };


    // Build the dom.
    // rows: HTML rows to be added to the Dom.
    pagebase.prototype.buildDom = function buildDom(rows) {
        // this.currentPage = 0;
        // while (this.rootNode.firstElementChild) {
        //     this.rootNode.firstElementChild.remove();
        // }
    //     this.addAll(rows);
    // };

    // pagebase.prototype.addAll = function addAll(rows) {
        var nodes = [];
        for (var i = 0; i < rows.length; i++) {
            var item = templates.item.cloneNode(true);
            if (!item.id) {
                item.id = this.name + '_' + i;
            }
            item.firstElementChild.id = this.name + '_' + i;
            item.firstElementChild.appendChild(this.templateFunc(rows[i], this.currentPage));
            nodes.push(item);
            // this.rootNode.appendChild(item);
        }

        if (this.getSort() === 'sorted') {
            var that = this;
            nodes.sort(function(a, b) { return that.compareFunc(a.textContent, b.textContent); });
        }

        for (var j = 0; j < nodes.length; j++) {
            this.rootNode.appendChild(nodes[j]);
        }
    };

    pagebase.prototype.sortChanged = function sortChanged(newSort) {
        this.updateSort(newSort);

        var items = Array.prototype.slice.call(this.rootNode.childNodes);
        if (items.length !== 0) {
            while (this.rootNode.lastChild) {
                this.rootNode.removeChild(this.rootNode.lastChild);
            }

            if  (newSort === 'sorted') {
                items.sort(this.sortFunc.bind(this));
            } else {
                items.sort(this.unsortFunc.bind(this));
            }

            for (var i = 0; i < items.length; i++) {
                this.rootNode.appendChild(items[i]);
            }
        }
    };

    // Returns the pages in the module.
    pagebase.prototype.getPages = function getPages() {
        // return Array.prototype.slice.call(this.elems.internal_selector.children);
    };

    // Remove pages.
    // pageNumber: The page to start removing data.
    pagebase.prototype.truncatePages = function truncatePages(pageNumber) {
        // var page_number = this.parentNode.id.remove('pages_');
        // var nodes = Array.prototype.slice.call(this.elems.internal_selector.children);
        // nodes.splice(0, parseInt(pageNumber) + 1);
        // nodes.forEach(function(node) {
        //     node.remove();
        // });
    };

    // Called when the number of items on a page changes.
    // pageItemCount: New number of items per page.
    pagebase.prototype.setPageItemCount = function setPageItemCount(pageItemCount) {
        // if (this.pageItemCount !== pageItemCount) {
        //     this.pageItemCount = Math.max(pageItemCount, 1);
        //     this.rebuildDom();
        // }
    };

    // Called when the visibility of options changes.
    // showOptions: True if options are now visible; false otherwise.
    pagebase.prototype.setShowOptions = function setShowOptions(showOptions) {
        if (this.showOptions !== showOptions) {
            this.showOptions = showOptions;
            // this.rebuildDom();
        }
    };
    
    pagebase.prototype.sortFunc = function sortFunc(a, b) {
        return this.compareFunc(a.textContent, b.textContent);
    };

    pagebase.prototype.unsortFunc = function unsortFunc(a, b) {
        return this.compareFunc(a.id, b.id);
    };

    pagebase.prototype.compareFunc = function compareFunc(a, b) {
        var nameA = a.toUpperCase();
        var nameB = b.toUpperCase();
        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        }
    };
    
    pagebase.prototype.getSort = function getSort() {
        var sort = storage.get('sort', defaults.getDefaultSort());
        return sort[this.name];
    };


    pagebase.prototype.updateSort = function updateSort(newSort) {
        var sort = storage.get('sort', defaults.getDefaultSort());
        sort[this.name] = newSort;
        storage.save('sort', sort);
    };

    return pagebase;
});
