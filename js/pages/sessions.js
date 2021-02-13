import jquery from 'jquery';
import PagebaseGrouped from '../pagebase/pagebase_grouped';
import util from '../utils/util';
let sessions = {
    name: 'sessions',

    enabled: false,
    setPermissionVisibility(visible, cb) {
        let that = this;
        if (visible) {
            chrome.permissions.request({
                    permissions: ['sessions']
                },
                function(granted) {
                    that.enabled = granted;
                    cb(granted);
                    that.loadSessions();
                }
            );
        } else {
            chrome.permissions.request({
                    permissions: ['sessions']
                },
                function(granted) {
                    that.enabled = !granted;
                    cb(granted);
                    that.loadSessions();
                }
            );
        }
    },

    data: {},

    elems: {},

    sessions: {},

    templates: {
        itemFragment: util.createElement(
            '<div class="session_item"></div>'
        ),
        titleFragment: util.createElement(
            '<a class="title clickable"></a>'
        ),
    },

    init() {
        this.elems.rootNode = document.getElementById(
            'internal-selector-sessions'
        );
        this.sessions = new PagebaseGrouped();
        this.sessions.init(
            document,
            this.name,
            this.elems.rootNode,
            this.templateFunc.bind(this)
        );

        this.loadSessions();
    },

    /**
     * Called when the sort order has been changed.
     *
     * @param {any} newSort The new sort order.
     */
    sortChanged(newSort) {
        this.sessions.sortChanged(newSort, false);
    },

    //
    /**
     * Loads the available sessions from local and web storage
     */
    loadSessions() {
        this.sessions.clear();
        if (!this.enabled) {
            this.sessions.addAll({
                heading: 'sessions',
                data: [{
                    title: 'Show open tabs and sessions.'
                }],
            });
            return;
        }

        let that = this;
        if (chrome.sessions.getDevices) {
            chrome.sessions.getDevices(null, (devices) => {
                for (let device of devices) {
                    let data = [];
                    for (let session of device.sessions) {
                        if (session.tab) {
                            data = data.concat(session);
                        } else if (session.window) {
                            data = data.concat(session.window.tabs);
                        }
                    }
                    that.sessions.addAll({
                        heading: device.deviceName,
                        data: data,
                    });
                }
            });
        } else {
            chrome.sessions.getRecentlyClosed(null, (sessions) => {
                let data = [];
                for (let session of sessions) {
                    if (session.tab) {
                        data = data.concat(session);
                    } else if (session.window) {
                        data = data.concat(session.window.tabs);
                    }
                }
                that.sessions.addAll({
                    heading: 'recently closed',
                    data: data,
                });
            });
        }
    },

    /**
     * Templates a provided tab into an HTML element.
     *
     * @param {any} tab The tab session that should be turned into an element.
     * @return {any} The HTML element.
     */
    templateFunc(tab) {
        let fragment = util.createElement('');

        let title = this.templates.titleFragment.cloneNode(true);
        title.firstElementChild.id = `session_${tab.index}`;
        title.firstElementChild.href = tab.url;
        title.firstElementChild.textContent = tab.title;
        fragment.appendChild(title);

        return fragment;
    },
};

export default sessions;
