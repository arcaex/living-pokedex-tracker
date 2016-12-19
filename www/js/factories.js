pokedexApp.factory('PokemonFactory', function($http) {
    return {
        get: function() {
            var pokemon_json = "data/pokemon.json";
            if (ionic.Platform.isAndroid()) {
                pokemon_json = "/android_asset/www/" + pokemon_json;
            }

            return $http.get(pokemon_json)
                .then(
                        function(response) {
                            return response.data;
                        },
                        function(http_error) {
                            throw http_error.status + " : " + http_error.data;
                        });

        }
    }
});
