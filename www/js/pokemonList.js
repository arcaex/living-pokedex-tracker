pokedexApp.controller('pokemonList', function($scope, $ionicScrollDelegate, $ionicSideMenuDelegate, PokemonFactory, PokedexService, ConfigService) {
    $scope.pokemon_master = [];
    $scope.pokemon_current_list = [];
    $scope.pokemon_visible_list = [];

    $scope.pokemon_settings = {};

    $scope.scroll_limit = 20;
    $scope.scroll_page = 0;

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
            $scope.changeLanguage();

            // Refresh the list
            $scope.refreshList();
        });

        // Load the config
        $scope.config = ConfigService.load();
        /*
        $http.get(pokemon_json).success(function(response) {
            $scope.pokemon_master = response;

            for(var index=0; index < $scope.pokemon_master.length; index++) {
                $scope.pokemon_master[index].name = $scope.pokemon_master[index]['names']['en'];
                $scope.pokemon_master[index].open = false;

            }

            $scope.changeLanguage();
            $scope.refreshList();
        });
        */
    }


    $scope.toggleMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }


    $scope.canWeLoadMoreContent = function() {
        return true;
    }

    $scope.refreshList = function() {
        console.log('refreshList...');
        $scope.pokemon_current_list = [];
        $scope.pokemon_visible_list = [];

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

    $scope.populateList = function() {
        var start = $scope.scroll_page*$scope.scroll_limit;
        var end = start + $scope.scroll_limit;

        start = Math.min(start, $scope.pokemon_current_list.length);
        end = Math.min(end, $scope.pokemon_current_list.length);
        
        console.log("Populate list: " + start + " to " + end);
        for(var i=start; i<end; i++) {
            $scope.pokemon_visible_list.push($scope.pokemon_current_list[i]);
        }
        $scope.scroll_page++;
        $scope.$broadcast('scroll.infiniteScrollComplete');

        $ionicScrollDelegate.resize();
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

    /* MODALS */

    $scope.closeModal = function() {
        $scope.modal.hide();
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

pokedexApp.filter('searchPokemon', function() {
    return function(items, query) {
        var filtered = [];
        var myRe = new RegExp(query, "ig");
        var result = [];

        for (var i=0; i<items.length; i++) {
            if (query) {
                result = myRe.exec(items[i].name);
                if (result) {
                    filtered.push(items[i]);
                }
            } else {
                filtered.push(items[i]);
            }
        }

        return filtered;
    };
});
