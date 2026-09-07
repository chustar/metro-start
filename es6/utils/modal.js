import util from '../utils/util';
import '../utils/storage';
export default {
    templates: {
        overlay: util.createElement(
            '<div class="metro-modal overlay-wrap"></div>'
        ),
        modalContent: util.createElement(
            '<div class="metro-modal modal-content"></div>'
        ),

        info: util.createElement('<div class="modal-info">'),
        confirm: util.createElement(
            '<button type="button" class="main-color clickable confirm-button"></button>'
        ),
        cancel: util.createElement(
            '<button type="button" class="main-color clickable cancel-button"></button>'
        ),
    },

    modalCallbacks: {},
    modalKeyHandlers: {},
    previousFocus: {},

    init() {},

    /**
     * Creates a new modal window.
     *
     * @param {any} id The id of the new modal that will be created.
     * @param {any} content The content to embed in the modal window.
     * @param {any} callback Function to call when the modal window closes.
     * @param {any} confirmText The text to display for confirmation. If empty, no confirm button will be shown.
     * @param {any} cancelText The tex to display for cancellation. If empty, no cancel button will be shown.
     */
    createModal(id, content, callback, confirmText, cancelText, options = {}) {
        this.modalCallbacks[id] = callback;
        this.previousFocus[id] = document.activeElement;

        let overlay;
        if (!options.drawer) {
            overlay = this.templates.overlay.cloneNode(true);
            overlay.firstElementChild.addEventListener(
                'click',
                this.modalClosed.bind(this, id, false)
            );
            util.addClass(overlay.firstElementChild, id);
        }

        const modalContent = this.templates.modalContent.cloneNode(true);
        const modalElement = modalContent.firstElementChild;
        const info = this.templates.info.cloneNode(true);

        if (confirmText) {
            // Do not show confirm button if the text is empty.
            const confirm = this.templates.confirm.cloneNode(true);
            confirm.firstElementChild.textContent = confirmText;
            confirm.firstElementChild.addEventListener(
                'click',
                this.modalClosed.bind(this, id, true)
            );
            info.firstElementChild.appendChild(confirm);
        }

        if (cancelText) {
            // Do not show cancel button if the text is empty.
            const cancel = this.templates.cancel.cloneNode(true);
            cancel.firstElementChild.textContent = cancelText;
            cancel.firstElementChild.addEventListener(
                'click',
                this.modalClosed.bind(this, id, false)
            );
            info.firstElementChild.appendChild(cancel);
        }

        modalElement.id = id;
        util.addClass(modalElement, id);
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute(
            'aria-modal',
            String(!options.drawer)
        );
        if (options.drawer) {
            util.addClass(modalElement, 'settings-drawer');
        }
        if (typeof content === 'string') {
            const paragraph = document.createElement('p');
            paragraph.textContent = content;
            modalElement.appendChild(paragraph);
        } else {
            modalElement.appendChild(content);
        }
        modalElement.appendChild(info);

        if (overlay) {
            document.body.append(overlay);
        }
        (options.container || document.body).append(modalContent);
        const keyHandler = (event) => {
            if (event.key === 'Escape') {
                this.modalClosed(id, false);
            }
        };
        this.modalKeyHandlers[id] = keyHandler;
        document.addEventListener('keydown', keyHandler);
        modalElement.querySelector('button')?.focus();
    },

    /**
     * Called when any modal window closes.
     *
     * @param {any} id The id of the modal that closed.
     * @param {any} res The result of the closing modal.
     */
    modalClosed(id, res) {
        document.removeEventListener('keydown', this.modalKeyHandlers[id]);
        delete this.modalKeyHandlers[id];
        const elems = document.getElementsByClassName(id);
        while (elems.length > 0) {
            elems[0].remove();
        }

        // If there are any callbacks for this modal.
        if (Boolean(this.modalCallbacks) && Boolean(this.modalCallbacks[id])) {
            this.modalCallbacks[id](res);
        }
        this.previousFocus[id]?.focus?.();
        delete this.previousFocus[id];
    },
};
