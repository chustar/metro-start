define(['../utils/util', '../utils/storage', './pagebase'], function(util, storage, pagebase) {
    var templates = {
       column: util.createElement('<div class="page"></div>'),
       item: util.createElement('<div class="item"></div>')
    };

    var pagebase_paneled = function pagebase_paneled() { };

    pagebase_paneled.prototype = Object.create(pagebase.prototype);

    pagebase_paneled.prototype.rebuildDom = function () {
      console.log("pagebase_paneled.rebuildDom was called");
    };

    pagebase_paneled.prototype.sortChanged = function sortChanged(newSort) {
        var currentSort = this.getSort();
        if (newSort === currentSort) {
            return;
        }

        this.updateSort(newSort);
        var columns = this.rootNode.children;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var rows = [];
            while (column.lastChild) {
                rows.push(column.lastChild);
                column.removeChild(column.lastChild);
            }

            if (newSort === 'sorted') {
                rows.sort(this.sortFunc);
            } else {
                rows.sort(this.unsortFunc);
            }

            for (var j = 0; j < rows.length; j++) {
                column.appendChild(rows[j]);
                // if (rows[j] is selected) {
                //     scroll to it.
                // }
            }
        }
    };

    // Adds all the given HTML nodes to the DOM in one single column.
    // nodes: List of nodes to be added.
    pagebase_paneled.prototype.addAllNodes = function addAllNodes(nodes) {
        if (nodes.length) {
            var pageIndex = this.elems.internal_selector.children.length;
            var columnNode = templates.column.cloneNode(true);
            columnNode.firstElementChild.id = this.name + '_' + pageIndex;
            var pageItemCount = this.pageItemCount - this.getReservedItemCount();

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

    // Gets how much space to reserve when displaying items.
    pagebase_paneled.prototype.getReservedItemCount = function getReservedItemCount() {
      // If the options are showing, account for sort options.
      if (this.showOptions) {
        // If its links page, account for add link options.
        return 1;
      }

      return 0;
    };

    return pagebase_paneled;
});
