define(['utils/util', 'utils/storage', 'pagebase/pagebase'], function(util, storage, pagebase) {
    var templates = {
       column: util.createElement('<div class="page"></div>'),
       item: util.createElement('<div class="item"></div>')
    };

    var pagebase_paneled = function pagebase_paneled() {
    }

    pagebase_paneled.prototype = Object.create(pagebase.prototype);

    pagebase.prototype.addAllNodes = function addAllNodes(nodes) {
        if (this.sort) {
            nodes.sort(this.compareFunc);
        } else {
            nodes.sort(function(a, b) {
                return a.id.toLocaleLowerCase() > b.id.toLocaleLowerCase();
            });
        }
        if (nodes.length) {
            // this.page = 0;
            var pageIndex = this.elems.internal_selector.children.length;
            var columnNode = templates.column.cloneNode(true);
            columnNode.firstElementChild.id = this.name + '_' + pageIndex;
            var pageItemCount = this.pageItemCount;
            if (this.showOptions) {
                pageItemCount--; // If the options are showing, account for sort options.
            }

            if (this.name === 'bookmarks') {
                util.addClass(columnNode.firstElementChild, 'bookmark-page');
            }
            //Add each row to an column and create new ones on the pageItemCount boundary.
            for (var i = 0; i < nodes.length; i++) {
                if (i !== 0 && i % pageItemCount === 0 && pageItemCount > 0) { //Skip the first row.
                    this.rootNode.appendChild(columnNode);
                    columnNode = templates.column.cloneNode(true);
                    columnNode.firstElementChild.id = this.name + '_' + pageIndex++;
                }
                columnNode.firstElementChild.appendChild(nodes[i]);
            }
            if ((i - 1) % this.pageItemCount !== 0 || this.pageItemCount === -1) { // - 1 to account for the for loop going one past last good index.
                this.rootNode.appendChild(columnNode);
            }
        }
    };

    return pagebase_paneled;
});
