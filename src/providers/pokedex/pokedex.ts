import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class PokedexProvider {

    private _pokemons:Object = {};

    constructor(public http:Http, public storage:Storage, public events:Events) { }

    load() {
        return this.storage.get("pokemons").then(data => {
            if (data != null) {
                let loadedPokedex:Object = JSON.parse(data);

                this._pokemons = loadedPokedex;
            } else {
                /* Try to load the existing pokedex from version 1 */
                if (window.localStorage['pokedex.pokemon'] != null) {
                    let previousPokedex:Object = JSON.parse(window.localStorage['pokedex.pokemon']);

                    for (let pokemon_number in previousPokedex) {
                        this._pokemons[pokemon_number] = previousPokedex[pokemon_number];
                    }

                    this.save();
                }
            }
        });
    }

    init(pokemonData, filters) {
        ['pokemons', 'alternate_forms'].forEach(single_data => {
            pokemonData[single_data].forEach(single_pokemon => {
                if (this.pokemons[single_pokemon['number']] == null) {
                    this.pokemons[single_pokemon['number']] = {};
                }
                filters.forEach(single_filter => {
                    if (this.pokemons[single_pokemon['number']][single_filter.id] == null) {
                        this.pokemons[single_pokemon['number']][single_filter.id] = false;
                    }
                });
            });
        });
    }

    reset() {
        this._pokemons = {};
    }

    save() {
        this.storage.set("pokemons", JSON.stringify(this._pokemons));

        this.events.publish('pokedexSaved', this._pokemons);
    }

    get pokemons():Object {
        return this._pokemons;
    }
}
