pokedexApp.controller('pokemonList', function($ionicModal, $scope, $ionicScrollDelegate, $ionicSideMenuDelegate, PokemonFactory, PokedexService, ConfigService) {
    $scope.pokemon_master = [];
    $scope.pokemon_current_list = [];

    $scope.pokemon_settings = {};

    $scope.config = {};

    $scope.languages = {};

    /*
     * Prepare the Pokemon detail modal
     * */
    $ionicModal.fromTemplateUrl('pokemon-detail.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });


    /*
     * Load the Pokemon list and the Pokemon settings
     * */
    $scope.getPokemon = function() {
        PokemonFactory.get().then(function(pokemon_list) {
            $scope.pokemon_master = pokemon_list;

            // Get settings from the Pokemon list (and create new if needed)
            $scope.pokemon_settings = PokedexService.load(pokemon_list);

            $scope.changeLanguage();

            $scope.refreshList();
        });

        // Load the config
        $scope.config = ConfigService.load();

        $scope.languages = ConfigService.languages;
        $scope.regions = ConfigService.regions;
        $scope.settings = PokedexService.SETTINGS;
    }


    /*
     * Refresh the current Pokemon list depending on the region and other filters
     * */
    $scope.refreshList = function() {
        $scope.pokemon_current_list = [];

        var pokemon;
        for(var i=0;i<$scope.pokemon_master.length;i++){

            pokemon = $scope.pokemon_master[i]; 

            // If this Pokemon is not in the current region Pokedex (and we are not usign the National Pokedex)
            if ($scope.config['pokedex'] != 'national' && pokemon['regions'][ $scope.config['pokedex'] ] == null) {
                continue; 
            }

            // From our filters, determine if we can add this Pokemon
            var canBeAdded = true;
            for (key in $scope.settings) {
                if ($scope.config['hide'][key] && $scope.pokemon_settings[pokemon.number][key]) {
                    canBeAdded = false;
                    break;
                }
            }
            if (!canBeAdded) {
                continue;
            }

            // Update the pokedex number depending on the selected region
            pokemon.current_number = pokemon.number;
            if ($scope.config['pokedex'] != 'national') {
                pokemon.current_number = pokemon['regions'][$scope.config['pokedex']];
            }

            $scope.pokemon_current_list.push(pokemon);
        }

        // Order the Pokemon with their current number
        function compare(a,b) {
            if (a.current_number < b.current_number)
                return -1;
            if (a.current_number > b.current_number)
                return 1;
            return 0;
        }
        $scope.pokemon_current_list.sort(compare);
    }


    /*
     * Change the shown Pokemon name and their evolution description
     * */
    $scope.changeLanguage = function() {
        for(var index=0; index < $scope.pokemon_master.length; index++) {
            $scope.pokemon_master[index].name = $scope.getPokemonName($scope.pokemon_master[index].number, $scope.config['language']);

            var evolution = $scope.pokemon_master[index]['evolution'];
            if (evolution != '' && evolution != undefined) {
                var matches = evolution.match(/#([0-9]+)/g);
                if (matches != null) {
                    for (var m=0; m<matches.length; m++) {
                        var number = matches[m];
                        evolution = evolution.replace(number, $scope.getPokemonName(number.substr(1), $scope.config['language']));
                    }

                    $scope.pokemon_master[index].current_evolution = evolution;
                }
            }
        }

        $scope.saveConfig();
    }


    /*
     * Helper to get the Pokemon name depending on the current language
     * Fallback to the English name if the name is not available
     * */
    $scope.getPokemonName = function(number, language) {
        var pokemon;
        for(var index=0; index<$scope.pokemon_master.length; index++) {
            pokemon = $scope.pokemon_master[index];
            if (pokemon.number == number) {
                var name = pokemon['names'][language];
                if (name == undefined && language != 'en') {
                    name = pokemon['names']['en'];
                }
                return name;
            }
        }
        return null;
    }


    /*
     * Show the left menu 
     * */
    $scope.toggleMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }


    /*
     * Show the Pokemon detail fron the filtered list with an index
     * */
    $scope.showPokemonDetail = function(filtered, index) {
        $scope.pokemon = filtered[index];
        $scope.filtered_list = filtered;
        $scope.index = index;
        if (!$scope.modal.isShown()) {
            $scope.modal.show();
        }
        $ionicScrollDelegate.resize();
    }


    /*
     * Close the modal 
     * */

    $scope.closeModal = function() {
        $scope.saveSettings();

        $scope.modal.hide();
    }


    /*
     * Pokemon settings related methods
     * */

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


    /*
     * Config related methods
     * */

    $scope.saveConfig = function() {
        ConfigService.save($scope.config);
    }


    $scope.configHasChanged = function() {
        $scope.scrollToTop();
        $scope.refreshList();
        $scope.saveConfig();
    }


    $scope.scrollToTop = function() {
        $ionicScrollDelegate.scrollTop();
    }
});

