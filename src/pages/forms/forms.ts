import { Component } from '@angular/core';
import { Events, NavController, ModalController, PopoverController } from 'ionic-angular';

import { ActionsPage } from '../actions/actions';
import { DetailPage } from '../detail/detail';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'page-forms',
    templateUrl: 'forms.html'
})
export class FormsPage {
    private search_filter:string = "";

    private pokemons:Array<Object> = [];

    private totalPokemons:number = 0;
    private ownedPokemons:number = 0;

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

        /* Build stats */
        let pokemons:Array<Object> = this.data.getRegionalPokemons();
        console.log(this.config.alternate_forms);
        if (this.config.alternate_forms['all']) {
            this.data.getData()['alternate_forms'].forEach(single_form => {
                pokemons.push({number: single_form['number']});
            });
        }
        this.totalPokemons = pokemons.length;
        this.ownedPokemons = pokemons.filter(single_pokemon => (this.pokedex.pokemons[single_pokemon['number']]['own'])).length;
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
