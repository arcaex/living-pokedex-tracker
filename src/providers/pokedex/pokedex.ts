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
        console.log("load");
        return this.storage.get("pokemons").then(data => {
            if (data != null) {
                let loadedPokedex:Object = JSON.parse(data);

                this._pokemons = loadedPokedex;

                console.log("Loading pokedex");
                console.log(loadedPokedex);
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
