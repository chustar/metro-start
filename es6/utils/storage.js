/* global chrome */
import ext from './extension';

export default {
    cache: {},
    initializing: undefined,
    listeners: new Set(),

    init() {
        if (!this.initializing) {
            this.initializing = new Promise((resolve) => {
                ext.storage.sync.get(null, (container) => {
                    Object.assign(this.cache, container || {});
                    if (ext.storage.onChanged && ext.storage.onChanged.addListener) {
                        ext.storage.onChanged.addListener(
                            (changes) => this.applyChanges(changes)
                        );
                    }
                    resolve(this);
                });
            });
        }

        return this.initializing;
    },

    /**
     * Saves the provided data to both local and shared stoarge.
     *
     * @param {any} key The name of the property to save.
     * @param {any} value The value to be saved.
     */
    save: function save(key, value) {
        if (this.cache) {
            this.cache[key] = value;
        }

        const obj = {};
        obj[key] = value;
        try {
            const result = ext.storage.sync.set(obj, () => {
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
                    this.reportError(chrome.runtime.lastError);
                }
            });
            if (result && typeof result.catch === 'function') {
                result.catch((error) => this.reportError(error));
            }
        } catch (error) {
            this.reportError(error);
        }
    },

    subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener); },

    applyChanges(changes) {
        Object.keys(changes || {}).forEach((key) => {
            const change = changes[key];
            if (!change || !Object.prototype.hasOwnProperty.call(change, 'newValue')) {
                return;
            }

            const newValue = change.newValue;
            if (JSON.stringify(this.cache[key]) === JSON.stringify(newValue)) {
                return;
            }

            this.cache[key] = newValue;
            this.listeners.forEach((listener) => listener(key, newValue));
        });
    },

    reportError(error) {
        console.error('Metro Start storage error', error);
        const message = document.createElement('div');
        message.className = 'storage-error';
        message.textContent = 'Could not save Metro Start data. Export a backup and try again.';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 6000);
    },

    exportBackup() {
        const keys = ['currentTheme', 'themesLocal', 'todos', 'weather', 'sort', 'page', 'pageOrder', 'focusMode'];
        return {version: 1, exportedAt: new Date().toISOString(), data: keys.reduce((out, key) => {
            if (this.cache[key] !== undefined) {
                out[key] = this.cache[key];
            }
            return out;
        }, {})};
    },

    importBackup(backup) {
        if (!backup || backup.version !== 1 || !backup.data || typeof backup.data !== 'object') {
            throw new Error('Invalid Metro Start backup');
        }
        const allowed = ['currentTheme', 'themesLocal', 'todos', 'weather', 'sort', 'page', 'pageOrder', 'focusMode'];
        allowed.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(backup.data, key)) {
                this.save(key, backup.data[key]);
            }
        });
    },

    /**
     * Gets a value from the cache; note that chrome.storage.sync always wins.
     *
     * @param {any} key The key to be retrieved.
     * @param {any} defaultValue The value to initialize all storages if the key does not exist.
     * @return {any} True if the value of the key if one exists exists; defaultValue otherwise.
     */
    get: function get(key, defaultValue) {
        const value = this.cache[key];
        return value === null || value === undefined ? defaultValue : value;
    },
};
