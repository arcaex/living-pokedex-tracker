pokedexApp.controller('pokemonList', function($scope, $ionicScrollDelegate, $ionicSideMenuDelegate, PokemonFactory, PokedexService, ConfigService) {
    $scope.pokemon_master = [];
    $scope.pokemon_current_list = [];

    $scope.pokemon_settings = {};

    $scope.config = {};

    /*
     * Load the Pokemon list and the Pokemon settings
     * */
    $scope.getPokemon = function() {
        PokemonFactory.get().then(function(pokemon_list) {
            $scope.pokemon_master = pokemon_list;

            // Get settings
            $scope.pokemon_settings = PokedexService.load(pokemon_list);

            // Prepare the list
            for (var i=0; i<$scope.pokemon_master; i++) {
                $scope.pokemon_master[i].open = false;
            }

            $scope.changeLanguage();

            // Refresh the list
            $scope.refreshList();
        });

        // Load the config
        $scope.config = ConfigService.load();
    }


    /*
     * Toggle
     * */
    $scope.toggleMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }


    $scope.toggleControls = function(pokemon_number) {
        console.log("toggle..." + pokemon_number);
        for (var i=0; i<$scope.pokemon_current_list.length; i++) {
            if ($scope.pokemon_current_list[i].number == pokemon_number) {
            $scope.pokemon_current_list[i].open = !$scope.pokemon_current_list[i].open; 
            break;
            }
        }
        $ionicScrollDelegate.resize();
    }

    $scope.refreshList = function() {
        console.log('refreshList...');
        $scope.pokemon_current_list = [];

        var pokemon = null;
        for(var i=0;i<$scope.pokemon_master.length;i++){
            pokemon = $scope.pokemon_master[i]; 

            // Verify if it's in the current pokedex
            if ($scope.config['pokedex'] != 'national' && pokemon['regions'][ $scope.config['pokedex'] ] == null) {
                continue; 
            }

            // Verify if we should hide owned pokemon
            if ($scope.config['only_show']['missing'] && $scope.pokemon_settings[pokemon.number]['own']) {
                continue;
            }

            // Verify if we should hide other pokemon
            if ($scope.config['hide']['shiny'] && $scope.pokemon_settings[pokemon.number]['shiny']) {
                continue;
            }
            if ($scope.config['hide']['language'] && $scope.pokemon_settings[pokemon.number]['language']) {
                continue;
            }
            if ($scope.config['hide']['pokeball'] && $scope.pokemon_settings[pokemon.number]['pokeball']) {
                continue;
            }

            pokemon.current_number = pokemon.number;
            if ($scope.config['pokedex'] != 'national') {
                pokemon.current_number = pokemon['regions'][$scope.config['pokedex']];
            }

            $scope.pokemon_current_list.push(pokemon);
        }


        function compare(a,b) {
            if (a.current_number < b.current_number)
                return -1;
            if (a.current_number > b.current_number)
                return 1;
            return 0;
        }

        $scope.pokemon_current_list.sort(compare);

        $scope.scroll_page = 0;
        $scope.populateList();
    }


    $scope.getHeight = function(pokemon) {
        if (pokemon.open) {
            return 149;
        } else {
            return 71;
        }
    }

    /* SETTINGS */

    $scope.saveSettings = function() {
        PokedexService.save($scope.pokemon_settings);
    }

    $scope.changeSettings = function(type, index) {
        var number = $scope.pokemon_master[index].number;

        if ($scope.pokemon_settings[number] == null) {
            $scope.pokemon_settings[number] = {};
        }
        if ($scope.pokemon_settings[number][type] == null) {
            $scope.pokemon_settings[number][type] = false;
        }
        $scope.pokemon_settings[number][type] = true;

        $scope.saveSettings();
    }

    $scope.getSettings = function(type, index) {
        var number = $scope.pokemon_master[index].number;

        if ($scope.pokemon_settings[number] != null && $scope.pokemon_settings[number][type] != null) {
            return $scope.pokemon_settings[number][type];
        }

        return false;
    }


    /* CONFIGS */

    $scope.saveConfig = function() {
        console.log('save config...');
        ConfigService.save($scope.config);
    }

    $scope.refreshPokemon = function() {
        $scope.refreshList();
        $scope.populateList();
        $scope.saveConfig();
    }

    $scope.changeLanguage = function() {
        for(var index=0; index < $scope.pokemon_master.length; index++) {
            var name = $scope.pokemon_master[index]['names'][ $scope.config['language'] ];
            if (name == undefined && $scope.config['language'] != 'en') {
                name = $scope.pokemon_master[index]['names']['en'];
            }

            $scope.pokemon_master[index].name = name;
        }

        $scope.saveConfig();
    }
});

