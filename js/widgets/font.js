define(['jquery', 'utils/script', 'utils/storage'], function(jquery, script, storage) {
    var font = {
        init: function(document) {
            var selector = jquery('#font-chooser');
            var index = 0;
            console.log(storage.get('fonts'));
            if (storage.get('fonts') === 'thin fonts') {
              index = 1;
            }
            selector.attr('selectedIndex', index);
            selector.metroSelect({
                'onchange': this.changeFont
            });
        },

        changeFont: function(font) {
            storage.save('font', font);
            script.updateFont();
            _gaq.push(['_trackEvent', 'Theme', 'Change Font', font]);
        },
    };

    return font;
});
