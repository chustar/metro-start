import weather from './weather';
import about from './about';

let _themesModule = null;

export default {
    weather: weather,
    about: about,

    data: [weather, about],

    init: function(document) {
        // Initialize light-weight or always-used widgets immediately.
        this.data.forEach((module) => {
            module.init(document);
        });

        // Defer loading the themes module until the user attempts to open it.
        const editBtn = document.getElementById('editThemeButton');
        if (editBtn) {
            const handler = async (e) => {
                editBtn.removeEventListener('click', handler);
                try {
                    if (!_themesModule) {
                        const mod = await import('./themes');
                        _themesModule = mod.default || mod;
                        _themesModule.init(document);
                    }
                    // After init, open the editor immediately.
                    if (_themesModule && _themesModule.openThemeEditor) {
                        _themesModule.openThemeEditor();
                    }
                } catch (err) {
                    console.error('Failed to load themes module:', err);
                }
            };
            editBtn.addEventListener('click', handler);
        }
    },
};
