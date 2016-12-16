pokedexApp.controller('pokemonList', function($scope, $ionicModal, $http, localStorageService, $ionicScrollDelegate, $ionicSideMenuDelegate) {

    var pokemonData = 'pokemon';

    $scope.pokemon_list = [];
    $scope.pokemon_visible_list = [];

    $scope.pokemon_settings = {};

    $scope.scroll_limit = 20;
    $scope.scroll_page = 0;

    $scope.settings = {};

    $scope.getPokemon = function() {

        var pokemon_json = "data/pokemon.json";
        if (ionic.Platform.isAndroid()) {
            pokemon_json = "/android_asset/www/" + pokemon_json;
        }
        var me = this;
        $http.get(pokemon_json).success(function(response) {
            $scope.pokemon_list = response;

            for(var index=0; index < $scope.pokemon_list.length; index++) {
                $scope.pokemon_list[index].name = $scope.pokemon_list[index]['names']['en'];
                $scope.pokemon_list[index].open = false;

                var settings = ['own','shiny','pokeball','language'];
                var pokemon = $scope.pokemon_list[index];
                if ($scope.pokemon_settings[pokemon.number] == null) {
                    $scope.pokemon_settings[pokemon.number] = {};
                }
                for(var j=0; j<settings.length; j++) {
                    if ($scope.pokemon_settings[pokemon.number][settings[j]] == null) {
                        $scope.pokemon_settings[pokemon.number][settings[j]] = false;
                    }
                }
            }

            $scope.changeLanguage();
            $scope.populateList();
        });

        if (localStorageService.get(pokemonData)) {
            $scope.pokemon_settings = localStorageService.get(pokemonData);
        } else {
            $scope.pokemon_settings = {};
        }


        if (localStorageService.get('config')) {
            $scope.settings = localStorageService.get('config');
        } else {
            $scope.settings = {};
            $scope.settings['pokedex'] = 'alola';
            $scope.settings['language'] = 'en';
            $scope.settings['hide'] = {};
            $scope.settings['hide']['language'] = false;
            $scope.settings['hide']['pokeball'] = false;
            $scope.settings['hide']['shiny'] = false;
            $scope.settings['only_show'] = {};
            $scope.settings['only_show']['missing'] = true;
        }

        /*
           $scope.pokemon_settings = [];
           localStorageService.set(pokemonData, $scope.pokemon_settings);
           */
    }


    $scope.toggleMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    }


    $scope.canWeLoadMoreContent = function() {
        return true;
    }

    $scope.populateList = function () {
        var start = $scope.scroll_page*$scope.scroll_limit;
        var end = start + $scope.scroll_limit;

        start = Math.min(start, $scope.pokemon_list.length);
        end = Math.min(end, $scope.pokemon_list.length);
        
        console.log("Populate list: " + start + " to " + end);
        for(var i=start; i<end; i++) {
            $scope.pokemon_visible_list.push($scope.pokemon_list[i]);
        }
        $scope.scroll_page++;
        $scope.$broadcast('scroll.infiniteScrollComplete');

    }

    $scope.getHeight = function(pokemon) {
        if (pokemon.open) {
            return 143;
        } else {
            return 72;
        }
    }

    $scope.saveSettings = function() {
        localStorageService.set(pokemonData, $scope.pokemon_settings);
    }


    $scope.changeSettings = function(type, index) {
        var number = $scope.pokemon_list[index].number;

        if ($scope.pokemon_settings[number] == null) {
            $scope.pokemon_settings[number] = {};
        }
        if ($scope.pokemon_settings[number][type] == null) {
            $scope.pokemon_settings[number][type] = false;
        }
        $scope.pokemon_settings[number][type] = true;

        localStorageService.set(pokemonData, $scope.pokemon_settings);
    }

    $scope.getSettings = function(type, index) {
        var number = $scope.pokemon_list[index].number;

        if ($scope.pokemon_settings[number] != null && $scope.pokemon_settings[number][type] != null) {
            return $scope.pokemon_settings[number][type];
        }

        return false;
    }

    $scope.toggleControls = function(index) {
        console.log("toggle..." + index);
        $scope.pokemon_list[index].open = !$scope.pokemon_list[index].open; 
         $ionicScrollDelegate.resize();
    }


    /* CONFIGS */

    $scope.saveConfig = function() {
        console.log('save config...');
        localStorageService.set('config', $scope.settings);
    }

    $scope.refreshPokemon = function() {
        $scope.saveConfig();
    }

    $scope.changeLanguage = function() {
        for(var index=0; index < $scope.pokemon_list.length; index++) {
            $scope.pokemon_list[index].name = $scope.pokemon_list[index]['names'][ $scope.settings['language'] ];
        }

        $scope.saveConfig();
    }
});
