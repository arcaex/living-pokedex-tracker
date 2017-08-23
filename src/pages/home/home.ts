import { Component } from '@angular/core';
import { Events, NavController, ModalController, PopoverController } from 'ionic-angular';

import { ActionsPage } from '../actions/actions';
import { DetailPage } from '../detail/detail';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private search_filter:string = "";

    private pokemons:Array<Object> = [];

    constructor(public navCtrl:NavController, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider, public modalCtrl:ModalController, public events:Events, public popoverCtrl:PopoverController) {
        this.events.subscribe('configSaved', data => {
            this.getPokemons();
        });
        this.events.subscribe('pokedexSaved', data => {
            this.getPokemons();
        });
    }

    ionViewDidEnter() {
        this.getPokemons();
    }

    selectPokemon(single_pokemon) {
        let modal = this.modalCtrl.create(DetailPage, {'pokemon':single_pokemon, 'parent': this});
        modal.present();
    }

    pokedexChanged() {
        this.pokedex.save();
    }

    getPokemons() {
        console.log("get...");
        this.pokemons = this.data.getPokemons().filter(single_pokemon => {
            if (this.search_filter != "") {
                if (single_pokemon['current_name'].toLowerCase().indexOf(this.search_filter.toLowerCase()) == -1) {
                    return false;
                }
            }

            return true;
        });
    }

    search(ev) {
        console.log("SEARCH: ");
        console.log(ev);
        this.getPokemons();
    }

    virtualScrollTracker(index, pokemon) {
        return pokemon['current_number'];
    }

    showActions(event) {
        let popover = this.popoverCtrl.create(ActionsPage, {pokemons:this.pokemons});
        popover.present({ev: event});
    }
}
