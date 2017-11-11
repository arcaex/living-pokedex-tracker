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

    private segment:String = "list";

    private breedingPokemons:Array<Object> = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider) {
        this.pokemon = this.navParams.get("pokemon");
        if (this.pokemon['breeding'] != undefined) {
            let matches = this.pokemon['breeding'].match(/#([0-9a-zA-Z-]+)/g);
            matches.forEach(single_match => {
                this.breedingPokemons.push(this.data.getPokemon(single_match.substr(1)));
            });
        }

        console.log(this.breedingPokemons);

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DetailPage');
    }

    ionViewWillUnload() {
        this.pokedex.save();
    }

    closeModal() {
        this.navCtrl.pop();
    }

    configChanged() {
        //this.data.refresh();
        //this.config.save();
        //this.pokedex.save();
        console.log("SHOULD SAVE THE POKEDEX?");
    }
}
