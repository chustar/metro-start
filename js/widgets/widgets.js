define(['widgets/weather', 'widgets/themes', 'widgets/font'], function() {
    var widgets = {
        data: Array.prototype.slice.call(arguments),

        init: function(document) {
            this.data.forEach(function(module) {
                module.init(document);
            });
        }
    };

    return widgets;
});
