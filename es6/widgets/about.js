import modal from '../utils/modal';
import storage from '../utils/storage';
export default {
    elems: {
        aboutModal: document.getElementById('aboutModal'),
        aboutButton: document.getElementById('aboutButton'),
        exportData: document.getElementById('exportData'),
        importData: document.getElementById('importData'),
        importDataFile: document.getElementById('importDataFile'),
    },

    init() {
        this.elems.aboutModal.parentNode.removeChild(this.elems.aboutModal);
        this.elems.aboutButton.addEventListener(
            'click',
            this.openAboutModal.bind(this)
        );
        this.elems.exportData.addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(storage.exportBackup(), null, 2)], {type: 'application/json'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `metro-start-backup-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            URL.revokeObjectURL(link.href);
        });
        this.elems.importData.addEventListener('click', () => this.elems.importDataFile.click());
        this.elems.importDataFile.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            try {
                storage.importBackup(JSON.parse(await file.text()));
                window.location.reload();
            } catch (error) {
                storage.reportError(error);
            } finally { event.target.value = ''; }
        });
    },

    /**
     * Shows the about modal modal window.
     */
    openAboutModal() {
        modal.createModal(
            'aboutModal',
            this.elems.aboutModal,
            this.aboutModalClosed.bind(this)
        );
    },

    /**
     * This function is unused.
     */
    aboutModalClosed() {},
};
