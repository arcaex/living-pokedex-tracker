pokedexApp.controller('pokemonList', function($scope, $ionicModal, $http, localStorageService) {

    var pokemonData = 'pokemon';

    $scope.pokemon_list = [];

    $scope.pokemon = {};

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
            }
        });

        if (localStorageService.get(pokemonData)) {
            $scope.pokemon_list = localStorageService.get(pokemonData);
        } else {
            $scope.pokemon_list = [];
        }

    }

    $scope.checkPokemon = function(index) {
        localStorageService.set(pokemonData, $scope.pokemon_list);
    }

    $scope.toggleControls = function(index) {
       $scope.pokemon_list[index].open = !$scope.pokemon_list[index].open; 
    }

});
