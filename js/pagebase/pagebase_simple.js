define(['utils/util', 'utils/storage', 'pagebase/pagebase'], function(util, storage, pagebase) {
  var templates = {
    column: util.createElement('<div class="page"></div>'),
    item: util.createElement('<div class="item"></div>')
  };

  var pagebase_simple = function pagebase_simple() {
  };

  pagebase_simple.prototype = Object.create(pagebase.prototype);

  pagebase_simple.prototype.addAllNodes = function addAllNodes(nodes) {
    if (this.sort) {
      nodes.sort(this.compareFunc);
    } else {
      nodes.sort(function(a, b) {
        return a.id.toLocaleLowerCase() > b.id.toLocaleLowerCase();
      });
    }

    if (nodes.length) {
      var pageIndex = this.elems.internal_selector.children.length;
      var columnNode = templates.column.cloneNode(true);
      columnNode.firstElementChild.id = this.name + '_' + pageIndex;
      var pageItemCount = this.pageItemCount - this.getReservedItemCount();

      //Add each row to an column and create new ones on the pageItemCount boundary.
      for (var i = 0; i < nodes.length; i++) {
        if (i !== 0 && i % pageItemCount === 0) { //Skip the first row.
          this.rootNode.appendChild(columnNode);
          columnNode = templates.column.cloneNode(true);
          columnNode.firstElementChild.id = this.name + '_' + pageIndex++;
        }
        columnNode.firstElementChild.appendChild(nodes[i]);
      }

      // i - 1 to account because the for-loop will go one past last good index.
      if ((i - 1) % this.pageItemCount !== 0) {
        this.rootNode.appendChild(columnNode);
      }
    }
  };

  pagebase_simple.prototype.getReservedItemCount = function getReservedItemCount() {
    // If the options are showing, account for sort options.
    if (this.showOptions) {
      // If its links page, account for add link options.
      if (this.name === 'links') {
        return 2;
      }

      return 1;
    }

    return 0;
  };

  return pagebase_simple;
});
