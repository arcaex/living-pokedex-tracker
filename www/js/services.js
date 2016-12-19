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


pokedexApp.service('ConfigService', function(localStorageService, PokedexService) {
    this.languages = {'en':'English', 'fr':'French', 'de':'German', 'es':'Spanish', 'jp':'Japanese'};

    this.regions = ['national', 'alola', 'kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos'];

    this.save = function(config) {
        localStorageService.set('config', config);  
    };

    this.load = function() {
        var config = {};
        if (localStorageService.get('config')) {
            config = localStorageService.get('config');
        } else {
            config['pokedex'] = 'alola';
            config['language'] = 'en';
            config['hide'] = {};

        }

        var settings = PokedexService.SETTINGS;
        for (key in settings) {
            if (config['hide'][key] == null || config['hide'][key] == undefined) {
                config['hide'][key] = settings[key]['default'];
            }
        }

        return config;
    };
});
