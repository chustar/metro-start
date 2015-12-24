define(['utils/defaults', 'utils/script', 'utils/storage'], function Utils(defaults, script, storage) {
    var utils = {
      // Initialize this module.
        init: function(document) { },

        // Return a function that calls the function if it exists, otherwise does nothing.
        // func: The function to be maybeied.
        maybe: function maybe(func) {
            return function() {
                if(func) return func(this.arguments);
            };
        },

        // Convert a function to a curried version.
        // arg: The argument to apply.
        // func: The function be curried.
        // TOOD: Convert this function to take multiple arguments.
        curry: function(arg, func) {
            return function() {
                func(arg);
            };
        },

        // Safely converts a JSON sring to an object.
        // str: The strig to be converted.
        getJSON: function getJSON(str) {
            var res = {};
            try {
                return JSON.parse(str);
            } catch(e) {
                return str;
            }
        },

        // Converts an HTML string to a DOM fragment.
        // htmlStr: The string to convert.
        createElement: function createDom(htmlStr) {
            var fragment = document.createDocumentFragment();
            if (htmlStr) {
                var temp = document.createElement('div');
                temp.innerHTML = htmlStr;
                fragment.appendChild(temp.firstElementChild);
            }
            return fragment;
        },

        // Add a CSS class to a DOM element.
        // elem: The DOM element to be mondified.
        // newClass: The class to be applied to the node.
        addClass: function addClass(elem, newClass) {
            var oldClass = elem.className.split(' ');
            if (oldClass.indexOf(newClass) === -1) {
                oldClass.unshift(newClass);
                elem.className = oldClass.join(' ');
            }
        },

        // Removes a CSS class from a DOM element.
        // elem: The DOM element to be modified.
        // className: The class to be addded to the node.
        removeClass: function removeClass(elem, className) {
            var oldClass = elem.className.split(' ');
            var index = oldClass.indexOf(className);
            if(index !== -1) {
                oldClass.splice(index, 1);
                elem.className = oldClass.join(' ');
            }
        }
    };

    return utils;
});
