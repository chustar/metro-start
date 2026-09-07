import {describe, expect, test} from 'bun:test';
import {Window} from 'happy-dom';
import util from '../es6/utils/util';
import styles from '../es6/utils/styles';
import storage from '../es6/utils/storage';
import defaults from '../es6/utils/defaults';
import script from '../es6/utils/script';

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;

describe('DOM utilities', () => {
    test('adds, detects, and removes classes', () => {
        const element = document.createElement('div');

        util.addClass(element, 'active');
        expect(util.hasClass(element, 'active')).toBeTrue();

        util.removeClass(element, 'active');
        expect(util.hasClass(element, 'active')).toBeFalse();
    });

    test('creates a reusable document fragment from markup', () => {
        const fragment = util.createElement('<span class="item">Metro</span>');

        expect(fragment.firstElementChild?.className).toBe('item');
        expect(fragment.firstElementChild?.textContent).toBe('Metro');
    });
});

describe('dynamic styles', () => {
    test('creates, updates, and removes a rule', () => {
        styles.set('.example', {color: 'red'});
        styles.set('.example', {'background-color': 'black'});

        const stylesheet = document.querySelector(
            'style[data-metro-start="theme"]'
        ).sheet;
        expect(stylesheet.cssRules).toHaveLength(1);
        expect(stylesheet.cssRules[0].style.color).toBe('red');

        styles.remove('.example');
        expect(stylesheet.cssRules).toHaveLength(0);
    });
});

describe('themes', () => {
    test('adds the default font size when upgrading older themes', () => {
        const theme = util.upgradeTheme({
            title: 'legacy',
            themeContent: {'font-chooser': 'system'},
        }, defaults.defaultTheme);

        expect(theme.themeContent['fontsize-chooser']).toBe('100%');
    });

    test('applies a theme without mutating current or previous state', () => {
        const current = structuredClone(defaults.defaultTheme);
        const previous = structuredClone(defaults.defaultTheme);
        current.themeContent['fontsize-chooser'] = '125%';
        const currentBefore = structuredClone(current);
        const previousBefore = structuredClone(previous);

        const applied = script.updateTheme(current, previous, false);

        expect(current).toEqual(currentBefore);
        expect(previous).toEqual(previousBefore);
        expect(applied.themeContent['fontsize-chooser']).toBe('125%');
    });

    test('opens and closes a dialog after its fragment is mounted', async () => {
        const {default: modal} = await import('../es6/utils/modal');

        expect(() => modal.createModal(
            'test-dialog',
            'confirm this action',
            null,
            'okay',
            'cancel'
        )).not.toThrow();
        expect(document.getElementById('test-dialog')).not.toBeNull();

        modal.modalClosed('test-dialog', false);
        expect(document.getElementById('test-dialog')).toBeNull();
    });
});

describe('storage synchronization', () => {
    test('ignores change events caused by its own writes', () => {
        const changes = [];
        const unsubscribe = storage.subscribe((key, value) => {
            changes.push([key, value]);
        });
        storage.cache.currentTheme = {title: 'metro start'};

        storage.applyChanges({
            currentTheme: {newValue: {title: 'metro start'}},
        });
        expect(changes).toHaveLength(0);

        storage.applyChanges({
            currentTheme: {newValue: {title: 'external theme'}},
        });
        expect(changes).toEqual([
            ['currentTheme', {title: 'external theme'}],
        ]);
        unsubscribe();
    });
});
