pokedexApp.service('PokedexService', function(localStorageService) {
    var settings_name = ['own', 'shiny', 'pokeball', 'language'];

    this.save = function(settings) {
        localStorageService.set('pokemon', settings); 
    };

    this.load = function(pokemon_list) {
        var settings = {};

        if (localStorageService.get('pokemon')) {
            settings = localStorageService.get('pokemon');
        }

        return configure(settings, pokemon_list);
    }

    function configure(settings, pokemon_list) {
        var pokemon;
        for (var i=0; i<pokemon_list.length; i++) {
            pokemon = pokemon_list[i];

            if (settings[pokemon.number] == null) {
                settings[pokemon.number] = {};
            }

            for (var j=0; j<settings_name.length; j++) {
                if (settings[pokemon.number][settings_name[j]] == null) {
                    settings[pokemon.number][settings_name[j]] = false;
                }
            }
        }

        return settings;
    }

});


pokedexApp.service('ConfigService', function(localStorageService) {
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
            config['only_show'] = {};
            config['only_show']['missing'] = true;

            return config;
        }
    };
});
