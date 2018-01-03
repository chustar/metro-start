define(['jquery', '../utils/util', '../utils/defaults', '../utils/storage', 'metro-select'], (jquery, util, defaults, storage) => {
    var weather = {
        data: {},

        elems: {
            weather: document.getElementById('weather'),
            saveLocation: document.getElementById('saveLocation'),
            newLocation: document.getElementById('newLocation'),
            toggleWeather: document.getElementById('toggleWeather'),

            city: document.getElementById('city'),
            currentTemp: document.getElementById('currentTemp'),
            highTemp: document.getElementById('highTemp'),
            lowTemp: document.getElementById('lowTemp'),
            condition: document.getElementById('condition'),
            unit: document.getElementById('unit')
        },
        
        init: function() {
            this.data = storage.get('weather', defaults.defaultWeather);

            this.elems.city.innerText = this.data.city;
            this.elems.currentTemp.innerText = this.data.currentTemp;
            this.elems.highTemp.innerText = this.data.highTemp;
            this.elems.lowTemp.innerText = this.data.lowTemp;
            this.elems.condition.innerText = this.data.condition;
            this.elems.unit.innerText = this.data.unit;

            this.elems.toggleWeather.addEventListener('click', this.toggleWeatherVisibilityDelegate.bind(this));
            this.elems.saveLocation.addEventListener('submit', this.saveLocationDelegate.bind(this));

            var chooser = jquery('#weather-unit-chooser');

            chooser.metroSelect({
                'initial': this.data.unit === 'c' ? 'celsius' : 'fahrenheit',
                'onchange': this.setWeatherUnitDelegate.bind(this)
        });

            this.updateWeather(this.data.city, this.data.unit, true);
            this.setWeatherVisibility(this.data.visible);
        },

        /**
         * Toggles whether the weather panel is visible.
         */
        toggleWeatherVisibilityDelegate: function() {
            this.setWeatherVisibility(!this.data.visible);
        },

        /**
         * Updates the current weather units.
         * 
         * @param {any} newWeatherUnit The new weather unit.
         */
        setWeatherUnitDelegate: function(newWeatherUnit) {
            this.update('unit', newWeatherUnit[0]);
            this.updateWeather(this.data.city, newWeatherUnit[0], true);            
        },

        /**
         * Updates the current weather location when the weather form is submitted.
         * @param {any} event: The from handle event.
         */
        saveLocationDelegate: function(event) {
            event.preventDefault();
            
            if (this.elems.newLocation.value.trim() !== this.data.city) {
                this.updateWeather(this.elems.newLocation.value.trim(), this.data.unit, true);
            }

            return false;
        },
        
        /**
         * Sets the visibility of the weather panel.
         * 
         * @param {any} visible: True is the weather element should be visible.
         */
        setWeatherVisibility: function(visible) {
            if (visible) {
                util.removeClass(this.elems.weather, 'hide');
            } else {
                util.addClass(this.elems.weather, 'hide');
            }

            this.elems.toggleWeather.innerText = visible ? 'hide weather' : 'show weather';
            this.update('visible', visible);
        },

        /**
         * Update the weather data being displayed.
         * 
         * @param {any} city The new city to use.
         * @param {any} unit The new weather unit to use.
         * @param {any} force Skip timeout check.
         */
        updateWeather: function(city, unit, force) {
            // If it has been more than an hour since last check.
            if(force || new Date().getTime() > parseInt(this.data.weatherUpdateTime, 10)) {
                this.update('weatherUpdateTime', parseInt(new Date().getTime(), 10) + 3600000);
                var params = encodeURIComponent(`select * from weather.forecast where woeid in (select woeid from geo.places where text="${city}" limit 1) and u="${unit  }"`);
                var url = `https://query.yahooapis.com/v1/public/yql?q=${params}&format=json`;
                var that = this;
                jquery.ajax(url).done((data) => {
                    if (data.query.count) {
                        var result = data.query.results.channel;

                        that.data.city = (`${result.location.city}, ${result.location.region ? result.location.region : result.location.country}`).toLowerCase();
                        that.data.currentTemp = result.item.condition.temp;
                        that.data.highTemp = result.item.forecast[0].high;
                        that.data.lowTemp = result.item.forecast[0].low;
                        that.data.condition = result.item.condition.text.toLowerCase();
                        that.data.unit = result.units.temperature.toLowerCase();

                        storage.save('weather', that.data);
                        that.update();
                    }
                });
            }
        },

        update: function(key, value) {
            if (key) {
                this.data[key] = value;
            }

            storage.save('weather', this.data);

            this.elems.city.innerText = this.data.city;
            this.elems.currentTemp.innerText = this.data.currentTemp;
            this.elems.highTemp.innerText = this.data.highTemp;
            this.elems.lowTemp.innerText = this.data.lowTemp;
            this.elems.condition.innerText = this.data.condition;
            this.elems.unit.innerText = this.data.unit;
        }
    };
    return weather;
});
