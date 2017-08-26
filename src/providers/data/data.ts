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
            this.pokemons = res.json()['pokemons'];
            this.refresh();
            return Promise.resolve(true);
        });
    }

    refresh() {
        this.master = this.getRegionalPokemons();

        /* Filter the list using ... tadam ... our filters */
        this.master = this.master.filter(single_pokemon => {
            for (let filter_id in this.config.filters) {
                if (this.config.filters[filter_id]) {
                    if (this.pokedex.pokemons[single_pokemon['number']][filter_id]) {
                        return false;
                    }
                }
            };
            return true;
        });

        /* Update the field */
        this.master.forEach(single_pokemon => {
            single_pokemon['current_number'] = single_pokemon['number'];
            single_pokemon['sprite'] = 'pokemon-' + single_pokemon['number'];

            /* Get the origin number for all alternate forms */
            if (single_pokemon['origin_number'] != "000") {
                single_pokemon['current_number'] = single_pokemon['origin_number'];
            }

            /* Change the current number for the selected pokedex */
            if (this.config.region['selected'] != 'national') {
                single_pokemon['current_number'] = single_pokemon['regions/' + this.config.region['selected']];
            }

            single_pokemon['current_name'] = this.getPokemonName(single_pokemon);

            /* Get the name of the origin Pokemon AND the alternate name */
            if (single_pokemon['origin_number'] != '000' && single_pokemon['form_name'] != null) {
                single_pokemon['current_name'] = this.getPokemonName(this.getPokemon(single_pokemon['origin_number'])) + ' - ' + single_pokemon['form_name'];
            }
        });

        console.log("TODO: Must update the evolution AND the breeding columns");
        /* Should use getPokemon(number...) */
        /*
        this.master.forEach(single_pokemon => {
            single_pokemon['current_evolution'] = single_pokemon['evolution'];
            var evolution = single_pokemon['current_evolution'];
            if (evolution != '' && evolution != undefined) {
                var matches = evolution.match(/#([0-9]+)/g);
                if (matches != null) {
                    for (var m=0; m<matches.length; m++) {
                        var number = matches[m];
                        this.master.forEach(named_pokemon => {
                            if (named_pokemon['number'] == number.substr(1)) {
                                evolution = evolution.replace(number, named_pokemon['current_name']);
                            }
                        });
                    }

                    single_pokemon['current_evolution'] = evolution;
                }
            }
        });
        */

        /* Order the list */
        this.master.sort(function(a, b) {
            if (a['current_number'] < b['current_number'])
                return -1;
            if (a['current_number'] > b['current_number'])
                return 1;
            return (a['current_name'] < b['current_name'] ? -1 : 1);
        });
    }

    /*
     * Return all Pokemons from the current region
     *
     * */
    getRegionalPokemons():Array<Object> {
        return this.pokemons.filter(single_pokemon => {
            if (this.config.region['selected'] != 'national') {
                if (single_pokemon['regions/' + this.config.region['selected']] == null) {
                    return false;
                }
            }
            return true;
        });
    }

    /*
     * Return the Pokemon from its national pokedex number
     *
     */
    getPokemon(pokemonNumber:number):Object {
        return this.getAllPokemons().filter(single_pokemon => (single_pokemon['number'] == pokemonNumber));
    }

    /*
     * Return the name of a Pokemon depending on the current language (and which one are available)
     *
     * */
    getPokemonName(pokemon:Object):string {
        let pokemonName:string = pokemon['names/en'];
        if (pokemon['names/' + this.config.language['selected']]) {
            pokemonName = pokemon['names/' + this.config.language['selected']];
        }
        return pokemonName;
    }

    /* 
     * Return all Pokemons matching the current settings
     *
     * */
    getPokemons(pokemonType:string = "", search:string = ""):Array<Object> {
        return this.master.filter(single_pokemon => {
            if ( (pokemonType == "forms" && single_pokemon['origin_number'] == "000") || (pokemonType == "pokemons" && single_pokemon['origin_number'] != "000") ) {
                return false;
            }

            /* Search in the name */
            if (search != "" && single_pokemon['current_name'].toLowerCase().indexOf(search.toLowerCase()) == -1) {
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
            if ( (pokemonType == "forms" && single_pokemon['origin_number'] == "000") || (pokemonType == "pokemons" && single_pokemon['origin_number'] != "000") ) {
                return false;
            }
            return true;
        });

        let stats:Object = {
            'total': totalPokemons.length,
            'owned': totalPokemons.filter(single_pokemon => (this.pokedex.pokemons[single_pokemon['number']['own']])).length
        };

        return stats;
    }
}
