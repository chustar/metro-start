import {describe, expect, test} from 'bun:test';
import {Window} from 'happy-dom';
import util from '../es6/utils/util';

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
