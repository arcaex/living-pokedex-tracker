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

    private master:Array<Object> = [];

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

     getPokemons() {
        this.master = this.data.getPokemons('forms', this.search_filter);
    }

    search() {
        console.log("SEARCH: ");
        this.getPokemons();
    }

    showActions(event) {
        let popover = this.popoverCtrl.create(ActionsPage, {pokemons:this.master});
        popover.present({ev: event});
    }

    getStats(type) {
        return this.data.getStats("forms")[type];
    }
}
