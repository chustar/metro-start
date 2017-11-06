define(['jquery', 'spectrum-colorpicker', 'throttle-debounce', '../utils/modal', '../utils/util', '../utils/storage', '../utils/defaults', '../utils/script'],
  function (jquery, spectrum, throttle_debounce, modal, util, storage, defaults, script) {
    var trianglifier = {

      isInit: false,

      data: {},

      elems: {
        themeEditor: document.getElementById('themeEditor'),
        trianglify: document.getElementById('trianglifyButton'),
        editThemeButton: document.getElementById('editThemeButton'),
        solidSection: document.getElementById('solid'),
        trianglifySection: document.getElementById('trianglify'),
      },

      textInputs: [
        document.getElementById('newThemeTitle'),
        document.getElementById('newThemeAuthor')
      ],

      colorInputs: [
        document.getElementById('backgroundColor'),
        document.getElementById('titleColor'),
        document.getElementById('mainColor'),
        document.getElementById('optionsColor'),
      ],

      selectInputs: [
        document.getElementById('font-chooser'),
        document.getElementById('background-chooser'),
        document.getElementById('trivariance-chooser'),
        document.getElementById('trisize-chooser'),
        document.getElementById('tristyle-chooser'),
      ],

      init: function () {
        this.data = util.upgradeTheme(storage.get('currentTheme', defaults.defaultTheme), defaults.deafultTheme);
        this.elems.themeEditor.parentNode.removeChild(this.elems.themeEditor);

        this.elems.editThemeButton.addEventListener('click', this.openThemeEditor.bind(this));

        // DEBUG
        var that = this;
        setTimeout(function() { that.elems.editThemeButton.click(); }, 500);
      },

      openThemeEditor: function() {
        modal.createModal('themeEditorModal', this.elems.themeEditor, this.themeEditorClosed.bind(this), 'save', 'cancel');

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
      },

      themeEditorClosed: function(res) {
        util.log(`theme editor closed with result: ${res}`);
      },

      /**
       * Attaches event handlers to the given text field.
       * 
       * @param {any} inputElement The name of the text field.
       */
      bindTextInput: function(inputElement) {
        inputElement.value = this.data[inputElement.id];
        inputElement.addEventListener('input', this.updateText.bind(this, inputElement.id));
      },

      /**
       * Create new metro-select for the given inputElement.
       * 
       * @param {any} inputElement The name of the field to turn into a metro-select.
       */
      bindSelectInput: function(inputElement) {
        jquery(inputElement).metroSelect({
          'initial': this.data[inputElement.id],
          'onchange': this.updateSelect.bind(this, inputElement.id)
        });
      },

      /**
       * Create new color picker element for the given inputElement.
       * 
       * @param {any} inputElement The name of the field to turn into a spectrum.
       */
      bindColorInput: function (inputElement) {
        jquery(inputElement).spectrum({
            chooseText: 'save color',
            replacerClassName: 'spectrum-replacer',
            appendTo: inputElement.parentNode,
            showButtons: false,
            color: this.data[inputElement.id],
            move: throttle_debounce.throttle(250, this.updateColor.bind(this, inputElement.id), true)
          });
      },
        
      /**
       * Handles changes to metro-select elements.
       * 
       * @param {any} inputElement The name of the metro-select that's changing.
       * @param {any} val The new value.
       */
      updateSelect: function(inputId, val) {
        
        if (inputId === 'background-chooser' || inputId === 'color-chooser') {
          var elems = document.getElementsByClassName(inputId.replace('chooser', 'section'));
          for (var i = 0; i < elems.length; i++) { 
            // If this element has the same id as our new select value, make it visible.
            if (elems[i].id === val) {
              util.removeClass(elems[i], 'hide');
            // Otherwise ensure its hidden.
            } else if (!util.hasClass(elems[i], 'hide')) {
                util.addClass(elems[i], 'hide');
            }
          }
        } 

        if (inputId === 'trivariance-chooser') {
          var triVariance = 0.75;
          switch (val) {
            case 'uniform':
            triVariance = 0;
            break;

            case 'freeform':
            triVariance = 0.75;
            break;

            default:
            console.error("Could not recognize trivariance: " + val);
            break;
          }
          this.updateCurrentTheme('triVariance', triVariance);

        } else if (inputId === 'trisize-chooser') {
          var triSize = 70;
          switch (val.toLowerCase()) {
            case 'small':
            triSize = 10;
            break;
            
            case 'medium':
            triSize = 70;
            break;

            case 'large':
            triSize = 125;
            break;

            default:
            console.error("Could not recognize trisize: " + val);
            break;
          }
          this.updateCurrentTheme('triSize', triSize);

        } else if (inputId === 'tristyle-chooser') {
          // Same as a general case select.
          // Just keeping it separete to be consistent with other tri*.
          this.updateCurrentTheme('triStyle', val);

        } else {
          this.updateCurrentTheme(inputId, val);
        }

      },

      /**
       * Handles changes to text elements.
       * 
       * @param {any} inputElement The name of the text that's changing.
       * @param {any} event The event that contains the new value.
       */
      updateText: function(inputId, event) {
        this.updateCurrentTheme(inputId, event.target.value);
      },

      /**
       * Handles changes to color elements.
       * 
       * @param {any} inputElement The name of the color field that's changing.
       * @param {any} event The new color.
       */
      updateColor: function (inputId, color) {
        this.updateCurrentTheme(inputId, color.toHexString());
      },
      
      /**
       * Randomizes the current thmee.
       */
      randomTheme: function () {
        for (var i = 0; i < this.colorInputs.length; i++) {
          let color = util.randomColor();

          jquery(`#${this.colorInputs[i].id}`).spectrum('set', color);
          this.data[this.colorInputs[i].id] = color;
        }

        script.updateTheme(this.currentTheme, true);
      },

      updateCurrentTheme: function (inputId, val) {
        util.logChange(inputId, val);
        this.data[inputId] = val;
        storage.save('currentTheme', this.data);

        script.updateTheme(this.data);
      },
      
      undoChanges: function () {
        this.currentTheme = storage.get('currentTheme', defaults.defaultTheme);
        script.updateTheme(this.currentTheme, true);

        for (var i = 0; i < this.colorInputs.length; i++) {
          let color = this.currentTheme[this.colorInputs[i].id];

          jquery(`#${this.colorInputs[i].id}`).spectrum('set', color);
          this.data[this.colorInputs[i].id] = color;
        }
      },
    };

    return trianglifier;
});