import jquery from 'jquery';
import utils from './utils/utils';
import widgets from './widgets/widgets';
import pages from './pages/pages';
import './../scss/reset.scss';
import './../scss/style.scss';
import '../node_modules/spectrum-colorpicker/spectrum.css';

let app = {
    data: {},

    elems: {
        hideRule: document.getElementById('hideRule'),
    },

    showOptions: false,

    utils: utils,

    modules: [utils, widgets, pages],

    init: function() {
        this.modules.forEach((module) => {
            module.init(document);
        });

        let that = this;
        let wrench = document.getElementById('wrench');
        wrench.addEventListener('click', () => {
            that.clickWrench();
            pages.changeToValidPage();
        });
    },

    /**
     * Shows the options on the page when the wrench is clicked.
     */
    clickWrench: function() {
        this.showOptions = !this.showOptions;

        if (this.showOptions) {
            document.body.removeChild(this.elems.hideRule);
        } else {
            document.body.appendChild(this.elems.hideRule);
        }
    },
};

// Initialize the app after the storage is done initializing.
// This ensures we can retrieve our data before rendering the page.
utils.storage.init().done(() => {
    if (document) {
        app.init();
    } else {
        jquery.ready(() => {
            app.init();
        });
    }
});

export default app;
