define(['jquery', 'spectrum-colorpicker', '../utils/modal', '../utils/util', '../utils/storage', '../utils/defaults', '../utils/script'],
  function (jquery, spectrum, modal, util, storage, defaults, script) {
    var trianglifier = {

      isInit: false,

      data: {},

      elems: {
        themeEditor: document.getElementById('themeEditor'),
        trianglify: document.getElementById('trianglifyButton'),
        editThemeButton: document.getElementById('editThemeButton'),
      },

      textInputs: [
        document.getElementById('trianglifierSize'),
        document.getElementById('trianglifierColorSpace'),
        document.getElementById('trianglifierStrokeWidth'),
        document.getElementById('trianglifierCellSize'),
        document.getElementById('trianglifierVariance'),
        document.getElementById('trianglifierSeed'),
        document.getElementById('newThemeTitle'),
        document.getElementById('newThemeAuthor')
      ],

      colorInputs: [
        document.getElementById('trianglifierXColor'),
        document.getElementById('trianglifierYColor'),
        document.getElementById('backgroundColor'),
        document.getElementById('titleColor'),
        document.getElementById('mainColor'),
        document.getElementById('optionsColor')
      ],

      selectInputs: [
        document.getElementById('font-chooser'),
      ],

      currentTrianglifer: {},

      init: function () {
        this.theme = storage.get('theme', defaults.defaultTheme);
        this.elems.themeEditor.parentNode.removeChild(this.elems.themeEditor);

        this.elems.editThemeButton.addEventListener('click', this.openThemeEditor.bind(this));

        // DEBUG
        var that = this;
        setTimeout(function() { that.elems.editThemeButton.click(); }, 500);
      },

      openThemeEditor: function() {
        if (!this.isInit) {
          for (var i = 0; i < this.textInputs.length; i++) {
            this.bindTextInput(this.textInputs[i]);
          }

          for (var j = 0; j < this.colorInputs.length; j++) {
            this.bindColorInput(this.colorInputs[j]);
          }

          for (var k = 0; k < this.selectInputs.length; k++) {
            this.bindSelectInput(this.selectInputs[k]);
          }

          this.isInit = true;
        }
          
        modal.createModal('themeEditorModal', this.elems.themeEditor, this.themeEditorClosed.bind(this));
      },

      bindTextInput: function(inputElement) {
        inputElement.addEventListener('input', this.updateText.bind(this, inputElement.id));
      },

      bindSelectInput: function(inputElement) {
        inputElement.selectedIndex = this.theme[inputElement.id];
        jquery(inputElement).metroSelect({
            'onchange': this.changeSelect.bind(this, inputElement.id)
        });
      },

      bindColorInput: function (inputElement) {
        jquery(inputElement).spectrum({
            chooseText: 'save color',
            replacerClassName: 'spectrum-replacer',
            appendTo: inputElement.parentNode,
            showButtons: false,
            color: this.data[inputElement.id],
            move: this.updateColor.bind(this, inputElement.id)
          });
      },
        
      changeSelect: function(inputId, val) {
        util.logChange(inputId, val);
        this.data[inputId] = val;
      },

      updateText: function(inputId, val) {
        util.logChange(inputId, val);
        this.data[inputId] = val;
      },

      updateColor: function (inputId, color) {
        util.logChange(inputId, color);
        this.data.colors[inputId] = color.toHexString();
      },
      
      randomTheme: function () {
        for (var i = 0; i < this.colorInputs.length; i++) {
          let color = util.randomColor();

          jquery(`#${this.colorInputs[i].id}`).spectrum('set', color);
          this.data[this.colorInputs[i].id] = color;
        }

        script.updateStyle(this.currentTheme, true);
      },

      themeEditorClosed: function(res) {
        util.log(`theme editor closed with result: ${res}`);
      },
      
      undoChanges: function () {
        this.currentTheme = storage.get('currentTheme', defaults.defaultTheme);
        script.updateStyle(this.currentTheme, true);

        for (var i = 0; i < this.colorInputs.length; i++) {
          let color = this.currentTheme[this.colorInputs[i].id];

          jquery(`#${this.colorInputs[i].id}`).spectrum('set', color);
          this.data[this.colorInputs[i].id] = color;
        }
      },
    };

    return trianglifier;
});