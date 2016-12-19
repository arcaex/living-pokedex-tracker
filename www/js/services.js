pokedexApp.service('PokedexService', function(localStorageService) {
    this.SETTINGS = {'own': {'label': 'Own', 'default': false}, 'shiny': {'label': 'Shiny', 'default': false}, 'pokeball': {'label': 'Pokeball', 'default': false}, 'language': {'label': 'Language', 'default': false}, 'iv': {'label': 'IV', 'default': false}, 'original_trainer': {'label':'O.T.', 'default': false}};

    this.save = function(settings) {
        localStorageService.set('pokemon', settings); 
    };

    this.load = function(pokemon_list) {
        var settings = {};

        if (localStorageService.get('pokemon')) {
            settings = localStorageService.get('pokemon');
        }

        return this.configure(settings, pokemon_list);
    }

    this.configure = function(settings, pokemon_list) {
        var pokemon;
        for (var i=0; i<pokemon_list.length; i++) {
            pokemon = pokemon_list[i];

            if (settings[pokemon.number] == null) {
                settings[pokemon.number] = {};
            }

            for (key in this.SETTINGS) {
                if (settings[pokemon.number][key] == null || settings[pokemon.number][key] == undefined) {
                    settings[pokemon.number][key] = this.SETTINGS[key]['default'];
                    //console.log('SEtting' + pokemon.number + ": " + key + " = " + this.SETTINGS[key]['default']);
                }
            }
        }

        return settings;
    }

});


pokedexApp.service('ConfigService', function(localStorageService) {
    this.languages = {'en':'English', 'fr':'French', 'de':'German', 'es':'Spanish', 'jp':'Japanese'};

    this.regions = ['national', 'alola', 'kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos'];

    this.save = function(config) {
        localStorageService.set('config', config);  
    };

    this.load = function() {
        if (localStorageService.get('config')) {
            return localStorageService.get('config');
        } else {
            var config = {};
            config['pokedex'] = 'alola';
            config['language'] = 'en';
            config['hide'] = {};
            config['hide']['language'] = false;
            config['hide']['pokeball'] = false;
            config['hide']['shiny'] = false;
            config['hide']['iv'] = false;
            config['hide']['original_trainer'] = false;
            config['only_show'] = {};
            config['only_show']['missing'] = true;

            return config;
        }
    };
});
