import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ConfigProvider } from '../config/config';
import { PokedexProvider } from '../pokedex/pokedex';

@Injectable()
export class DataProvider {

    private data:Object = {};

    private master:Array<Object> = [];

    constructor(public http:Http, public config:ConfigProvider, public pokedex:PokedexProvider) { }

    load(type:string) {
        return this.http.get('assets/json/' + type + '.json').toPromise().then(res => {
            this.data[type] = res.json()[type];
            this.refresh();
            return Promise.resolve(true);
        });
    }

    refresh() {
        /* Filter the list */
        if (this.data['pokemons'] != null && this.data['alternate_forms'] != null) {
            this.master = this.data['pokemons'].filter(single_pokemon => {
                if (this.config.region['selected'] != 'national') {
                    if (single_pokemon['regions'][this.config.region['selected']] == null) {
                        return false;
                    }
                }

                for (let filter_id in this.config.filters) {
                    if (this.config.filters[filter_id]) {
                        if (this.pokedex.pokemons[single_pokemon['number']][filter_id]) {
                            return false;
                        }
                    }
                };

                return true;
            });

            /* Add alternate forms (if they are in the master list) */
            if (this.config.alternate_forms['all']) {
                this.data['alternate_forms'].forEach(single_form => {
                    let existingPokemon = this.master.filter(single_pokemon => (single_pokemon['number'] == single_form['origin_number']));
                    existingPokemon.forEach(single_pokemon => {
                        let newPokemon = Object.create(single_pokemon);
                        newPokemon.number = single_form['number'];
                        newPokemon.form_name = single_form['names/en'];
                        newPokemon.origin_number = single_form['origin_number'];
                        this.master.push(newPokemon);
                    });
                });
            }

            /* Update the field */
            this.master.forEach(single_pokemon => {
                single_pokemon['current_number'] = (single_pokemon['origin_number'] != null ? single_pokemon['origin_number'] : single_pokemon['number']);
                if (this.config.region['selected'] != 'national') {
                    single_pokemon['current_number'] = single_pokemon['regions/' + this.config.region['selected']];
                }

                single_pokemon['current_name'] = single_pokemon['names/en'];
                if (single_pokemon['names/' + this.config.language['selected']]) {
                    single_pokemon['current_name'] = single_pokemon['names/' + this.config.language['selected']];
                }

                single_pokemon['sprite'] = 'pokemon-' + single_pokemon['number'];

                if (single_pokemon['form_name'] != null && this.config.alternate_forms['all']) {
                    single_pokemon['current_name'] += ' - ' + single_pokemon['form_name'];
                }
            });

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

            /* Order the list */
            this.master.sort(function(a, b) {
                if (a['current_number'] < b['current_number'])
                    return -1;
                if (a['current_number'] > b['current_number'])
                    return 1;
                return (a['current_name'] < b['current_name'] ? -1 : 1);
            });
        }
    }

    getPokemons() {
        return this.master;
    }
}
