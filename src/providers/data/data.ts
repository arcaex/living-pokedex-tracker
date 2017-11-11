import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ConfigProvider } from '../config/config';
import { PokedexProvider } from '../pokedex/pokedex';

@Injectable()
export class DataProvider {

    private pokemons:Array<Object> = [];

    private master:Array<Object> = [];

    constructor(public http:Http, public config:ConfigProvider, public pokedex:PokedexProvider) { }

    load() {
        return this.http.get('assets/json/data.json').toPromise().then(res => {
            this.generatePokemons(res.json());
            return Promise.resolve(true);
        });
    }

    /*
     * Generate a basic list from the JSON (Normal Pokemon and form)
     *
     * */
    generatePokemons(data:Object) {
        /* Add all normal Pokemon */
        data['pokemons'].forEach(single_pokemon => {
            single_pokemon['type'] = "pokemon";
            single_pokemon['number'] = single_pokemon['national'];
            this.pokemons.push(single_pokemon);
        });

        /* Add all forms based on a normal Pokemon */
        data['forms'].forEach(single_form => {
            let single_pokemon = Object.assign({}, this.getPokemon(single_form['national']));
            single_pokemon['number'] = single_form['number'];
            ['fr', 'en', 'kr', 'es', 'jp'].forEach(single_lang => {
                if (single_pokemon['names/' + single_lang] != undefined) {
                    single_pokemon['names/' + single_lang] += " - " + single_form['names/en'];
                }
            })
            single_pokemon['type'] = "form";

            /* @TODO: If generation in form, use that instead of the generation of the origin */
            if (single_form['breeding'] != undefined) {
                single_pokemon['breeding'] = single_form['breeding'];
            }

            /* Update the value from the form */
            for (let key in single_form) {
                if (key.substr(0, 6) == 'evolve') {
                    single_pokemon[key] = single_form[key];
                }
            }

            this.pokemons.push(single_pokemon);
        });
    }

    refresh() {
        this.master = this.getRegionalPokemons();
        console.log(this.master.length);

        /* Update the field */
        this.master.forEach(single_pokemon => {
            single_pokemon['current_number'] = single_pokemon['national'];
            single_pokemon['sprite'] = 'pokemon-' + single_pokemon['number'];

            /* Get the origin number for all alternate forms */
            if (single_pokemon['type'] == "form") {
                single_pokemon['current_number'] = single_pokemon['national'];
            }

            /* Change the current number for the selected pokedex */
            if (this.config.generation['selected'] != 'national') {
                single_pokemon['current_number'] = single_pokemon['generation/' + this.config.generation['selected']];
            }

            single_pokemon['current_name'] = this.getPokemonName(single_pokemon);

            single_pokemon['current_breeding'] = this.replacePokemonsName(single_pokemon['breeding']);
            single_pokemon['current_evolving'] = this.replacePokemonsName(single_pokemon['evolving']);
        });

        /* Order the list */
        this.master.sort(function(a, b) {
            if (a['current_number'] < b['current_number'])
                return -1;
            if (a['current_number'] > b['current_number'])
                return 1;
            return (a['current_name'] < b['current_name'] ? -1 : 1);
        });

        console.log(this.master.length);
    }

    /*
     * Return all Pokemons from the current region
     *
     * */
    getRegionalPokemons():Array<Object> {
        return this.pokemons.filter(single_pokemon => {
            if (this.config.generation['selected'] != 'national') {
                if (single_pokemon['generation/' + this.config.generation['selected']] == null) {
                    return false;
                }
            }
            return true;
        });
    }

    /*
     * Return a Pokemon from its national pokedex number
     *
     */
    getPokemon(pokemonNumber:string):Object {
        return this.getAllPokemons().filter(single_pokemon => (single_pokemon['number'] == pokemonNumber))[0];
    }

    /*
     * Return the name of a Pokemon depending on the current language (and which one are available)
     *
     * */
    getPokemonName(pokemon:Object):string {
        let pokemonName:string = pokemon['names/en'];
        if (pokemon['names/' + this.config.language['selected']] != undefined) {
            pokemonName = pokemon['names/' + this.config.language['selected']];
        }

        if (pokemon['type'] != 'form' && pokemon['form_name'] != null) {
        //    pokemonName = this.getPokemonName(this.getPokemon(pokemon['origin_number'])) + ' - ' + pokemon['form_name'];
        }
        return pokemonName;
    }

    /* 
     * Return all Pokemons matching the current settings
     *
     * */
    getPokemons(pokemonType:string = "", search:string = ""):Array<Object> {
        return this.master.filter(single_pokemon => {
            if ( (pokemonType == "forms" && single_pokemon['type'] != "form") || (pokemonType == "pokemons" && single_pokemon['type'] != "pokemon") ) {
                return false;
            }
            return true;
        });
    }

    /*
     * Return all Pokemons from the JSON
     *
     * */
    getAllPokemons():Array<Object> {
        return this.pokemons;
    }

    /*
     * Return stats of the current Pokemons progression
     *
     * */
    getStats(pokemonType:string = ""):Object {
        let totalPokemons = this.getRegionalPokemons().filter(single_pokemon => {
            if ( (pokemonType == "forms" && single_pokemon['type'] != "form") || (pokemonType == "pokemons" && single_pokemon['type'] != "pokemon") ) {
                return false;
            }
            return true;
        });

        let stats:Object = {
            'total': totalPokemons.length,
            'owned': totalPokemons.filter(single_pokemon => (this.pokedex.pokemons[single_pokemon['number']]['own'])).length
        };

        return stats;
    }

    /*
     * Replace a string containing Pokemon national number (#102) with the correct name (of the selected language)
     *
     * */
    replacePokemonsName(names:string):string {
        if (names != null) {
            var matches = names.match(/#([0-9a-zA-Z-]+)/g);
            if (matches != null) {
                for (var m=0; m<matches.length; m++) {
                    let fullNumber = matches[m];
                    let onlyNumber = fullNumber.substr(1);
                    names = names.replace(fullNumber, this.getPokemonName(this.getPokemon(onlyNumber)));
                }
            }
        }
        return names;
    }
}
