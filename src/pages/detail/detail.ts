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

    constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
    }

    closeModal() {
        this.navCtrl.pop();
    }
}
