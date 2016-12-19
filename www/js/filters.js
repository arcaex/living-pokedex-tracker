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
