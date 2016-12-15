pokedexApp.controller('pokemonList', function($scope, $ionicModal, $http, localStorageService) {

    var pokemonData = 'pokemon';

    $scope.pokemon_list = [];

    $scope.pokemon_settings = {};

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
            console.log("LOAD");
            console.log($scope.pokemon_settings);
        });

        if (localStorageService.get(pokemonData)) {
            $scope.pokemon_settings = localStorageService.get(pokemonData);
        } else {
            $scope.pokemon_settings = {};
        }

        /*
        $scope.pokemon_settings = [];
        localStorageService.set(pokemonData, $scope.pokemon_settings);
        */

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
       $scope.pokemon_list[index].open = !$scope.pokemon_list[index].open; 
    }

});
