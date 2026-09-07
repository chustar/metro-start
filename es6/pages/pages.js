import MetroSelect from 'metro-select';
import styles from '../utils/styles';
import storage from '../utils/storage';
import defaults from '../utils/defaults';
import todos from './todos';
import sessions from './sessions';
import apps from './apps';
import bookmarks from './bookmarks';
import themes from './themes';
import ext from '../utils/extension';
export default {
    name: 'pages',

    elems: {
        chooser: document.getElementById('pages-chooser'),
    },

    modules: [todos, sessions, apps, bookmarks, themes],

    init(document) {
        this.showOptions = false;
        this.page = storage.get('page', 'todos');
        document.addEventListener('metro-open-theme-editor', () => {
            this.chooser?.select?.('themes');
        });

        const that = this;
        ext.permissions.getAll((perms) => {
            const permissions = (perms && perms.permissions) || [];
            if (ext.management && permissions.includes('management')) {
                document.querySelectorAll('.apps-option').forEach((element) => {
                    element.classList.remove('removed');
                });
                apps.enabled = true;
            } else if (that.page === 'apps') {
                that.page = 'todos';
            }

            if (ext.bookmarks && permissions.includes('bookmarks')) {
                document.querySelectorAll('.bookmarks-option').forEach((element) => {
                    element.classList.remove('removed');
                });
                bookmarks.enabled = true;
            } else if (that.page === 'bookmarks') {
                that.page = 'todos';
            }

            if (ext.sessions && permissions.includes('sessions')) {
                document.querySelectorAll('.sessions-option').forEach((element) => {
                    element.classList.remove('removed');
                });
                sessions.enabled = true;
            } else if (that.page === 'sessions') {
                that.page = 'todos';
            }

            that.setOrder(storage.get('pageOrder', defaults.defaultPageOrder), false);
            that.modules.forEach((module) => {
                module.init(document);
            });

            that.chooser = new MetroSelect(that.elems.chooser, {
                initial: that.page,
                addText: '+',
                removeText: '×',
                addRemoveClass: 'addremove_button option options-color',
                parentRemovedClass: 'option disabled',
                onChange: that.changePage.bind(that),
                onVisibilityChange: that.visibilityChanged.bind(that),
            });

            // Set the initial page.
            that.changeToValidPage();
            document.dispatchEvent(new CustomEvent('metro-pages-ready'));
        });
    },

    setOrder(order, refresh = true) {
        const positions = new Map(order.map((name, index) => [name, index]));
        this.modules.sort((a, b) => {
            return (positions.get(a.name) ?? 99) - (positions.get(b.name) ?? 99);
        });
        const container = document.querySelector('.external > .internal');
        this.modules.forEach((module) => {
            const collection = container.querySelector(`.${module.name}.collection`);
            if (collection) {
                container.appendChild(collection);
            }
        });
        if (refresh && this.chooser?.select) {
            this.changePage(this.page);
        }
    },

    changeToValidPage() {
        let page = this.page;
        if (!page) {
            page = 'todos';
        }
        if (page === 'apps' && !apps.enabled) {
            page = 'todos';
        }

        if (page === 'bookmarks' && !bookmarks.enabled) {
            page = 'todos';
        }

        if (page === 'sessions' && !sessions.enabled) {
            page = 'todos';
        }

        this.chooser.select(page);
    },

    /**
     * Change the currently selected page.
     *
     * @param {any} page The new page.
     */
    changePage: function changePage(page) {
        this.page = page;
        storage.save('page', page);

        let moduleIndex = this.modules
            .map((m) => {
                return m.name;
            })
            .indexOf(page);

        document.querySelectorAll('.external .internal .collection').forEach(
            (element) => element.classList.add('off-screen')
        );
        document.querySelectorAll(`.external .internal .collection.${page}`).forEach(
            (element) => element.classList.remove('off-screen')
        );
        document.querySelectorAll(`.${page}-option`).forEach((element) => {
            element.classList.remove('removed', 'disabled');
        });

        if (moduleIndex < 0) {
            moduleIndex = 0;
        }
        styles.set('.external .internal', {
            'margin-left': `${moduleIndex * -100}%`,
        });
        document.dispatchEvent(new CustomEvent('metro-page-change', {
            detail: {page},
        }));
    },

    visibilityChanged: function visibilityChanged(page, visibility, cb) {
        const modules = this.modules.filter((m) => {
            return m.name === page;
        });
        if (modules.length) {
            const module = modules[0];
            if (module.setPermissionVisibility) {
                module.setPermissionVisibility(visibility, cb);
            }
        }
    },
};
