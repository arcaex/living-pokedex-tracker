import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html',
})
export class DetailPage {

    private pokemon:Object = {};

    constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider) {
        this.pokemon = this.navParams.get("pokemon");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
    }

    closeModal() {
        this.navCtrl.pop();
    }

    configChanged() {
        //this.data.refresh();
        //this.config.save();
        this.pokedex.save();
        console.log("SHOULD SAVE THE POKEDEX?");
    }
}
