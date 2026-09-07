import storage from './storage';
import defaults from './defaults';
import pages from '../pages/pages';

const isTyping = (event) => ['INPUT', 'SELECT', 'TEXTAREA']
    .includes(event.target?.tagName);

export default {
    nav: document.getElementById('sectionNav'),
    focusButton: document.getElementById('focusMode'),
    touchStartX: 0,
    wheelLocked: false,
    pointerFrame: 0,

    init() {
        document.addEventListener('metro-pages-ready', () => {
            this.renderNavigation();
        }, {once: true});
        this.setFocusMode(Boolean(storage.get('focusMode', false)), false);
        this.focusButton.addEventListener('click', () => {
            this.setFocusMode(!document.body.classList.contains('focus-mode'));
        });
        document.addEventListener('metro-page-change', () => this.syncNavigation());
        document.addEventListener('metro-navigation-change', () => {
            this.renderNavigation();
        });
        document.addEventListener('keydown', (event) => {
            if (isTyping(event) || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }
            if (event.key === 'ArrowLeft') {
                this.move(-1);
            } else if (event.key === 'ArrowRight') {
                this.move(1);
            } else if (event.key.toLowerCase() === 'f') {
                this.focusButton.click();
            }
        });
        const viewport = document.querySelector('.external');
        viewport.addEventListener('touchstart', (event) => {
            this.touchStartX = event.changedTouches[0].clientX;
        }, {passive: true});
        viewport.addEventListener('touchend', (event) => {
            const distance = event.changedTouches[0].clientX - this.touchStartX;
            if (Math.abs(distance) > 55) {
                this.move(distance > 0 ? -1 : 1);
            }
        }, {passive: true});
        viewport.addEventListener('wheel', (event) => {
            if ((!event.shiftKey && Math.abs(event.deltaX) < Math.abs(event.deltaY)) ||
                this.wheelLocked) {
                return;
            }
            event.preventDefault();
            const direction = (event.deltaX || event.deltaY) > 0 ? 1 : -1;
            this.move(direction);
            this.wheelLocked = true;
            setTimeout(() => { this.wheelLocked = false; }, 350);
        }, {passive: false});
        document.addEventListener('pointermove', (event) => {
            if (this.pointerFrame || event.pointerType === 'touch') {
                return;
            }
            this.pointerFrame = requestAnimationFrame(() => {
                const x = (event.clientX / window.innerWidth - 0.5) * 2;
                const y = (event.clientY / window.innerHeight - 0.5) * 2;
                document.documentElement.style.setProperty('--pointer-x', x);
                document.documentElement.style.setProperty('--pointer-y', y);
                this.pointerFrame = 0;
            });
        }, {passive: true});
    },

    availablePages() {
        return pages.modules.filter((module) => {
            return module.visible !== false &&
                (!['apps', 'bookmarks', 'sessions'].includes(module.name) ||
                module.enabled);
        });
    },

    move(offset) {
        const available = this.availablePages();
        const current = available.findIndex((module) => module.name === pages.page);
        const next = available[current + offset];
        if (next) {
            pages.chooser.select(next.name);
        }
    },

    renderNavigation() {
        this.nav.replaceChildren();
        const savedOrder = storage.get('pageOrder', defaults.defaultPageOrder);
        const order = [
            ...savedOrder,
            ...pages.modules
                .map((module) => module.name)
                .filter((name) => !savedOrder.includes(name)),
        ];
        for (const name of order) {
            const module = pages.modules.find((item) => item.name === name);
            if (!module) {
                continue;
            }
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `${name}-nav options-color`;
            button.dataset.page = name;
            button.draggable = true;
            button.textContent = name;
            button.addEventListener('click', () => {
                if (pages.chooser?.options?.has(name)) {
                    pages.chooser.select(name);
                } else {
                    pages.changePage(name);
                }
            });
            button.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', name);
            });
            button.addEventListener('dragover', (event) => event.preventDefault());
            button.addEventListener('drop', (event) => {
                event.preventDefault();
                this.reorder(event.dataTransfer.getData('text/plain'), name);
            });
            this.nav.appendChild(button);
        }
        this.syncNavigation();
    },

    reorder(source, target) {
        if (!source || source === target) {
            return;
        }
        const order = [...storage.get('pageOrder', defaults.defaultPageOrder)];
        const sourceIndex = order.indexOf(source);
        const targetIndex = order.indexOf(target);
        if (sourceIndex < 0 || targetIndex < 0) {
            return;
        }
        order.splice(targetIndex, 0, order.splice(sourceIndex, 1)[0]);
        storage.save('pageOrder', order);
        pages.setOrder(order);
        this.renderNavigation();
    },

    syncNavigation() {
        this.nav.querySelectorAll('button').forEach((button) => {
            const selected = button.dataset.page === pages.page;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-current', selected ? 'page' : 'false');
            const module = pages.modules.find(
                (item) => item.name === button.dataset.page
            );
            button.hidden = Boolean(module && (module.visible === false ||
                (!module.enabled &&
                ['apps', 'bookmarks', 'sessions'].includes(module.name))));
        });
    },

    setFocusMode(enabled, persist = true) {
        document.body.classList.toggle('focus-mode', enabled);
        this.focusButton.textContent = enabled ? 'exit focus' : 'focus';
        this.focusButton.setAttribute('aria-pressed', String(enabled));
        if (persist) {
            storage.save('focusMode', enabled);
        }
    },
};
