import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl:NavController, public config:ConfigProvider, public data:DataProvider) {
    }

    selectPokemon(single_pokemon) {
        console.log("SELECT POKEMON");
    }
}
