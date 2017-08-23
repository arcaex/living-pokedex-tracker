import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'page-actions',
    templateUrl: 'actions.html',
})
export class ActionsPage {

    private pokemons:Array<Object> = [];

    constructor(public navCtrl:NavController, public navParams:NavParams, public alertCtrl:AlertController, public pokedex:PokedexProvider) {
        this.pokemons = this.navParams.get("pokemons");
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ActionsPage');
    }

    resetConfigs() {
        let alert = this.alertCtrl.create({
            title:"Confirmation",
            message:"Are you sure you want to <strong>reset</strong> all the data? <br /><br /><strong>This operation is irreversible!</strong>",
            buttons: [
                {
                    "text": "No",
                    "role": "cancel"
                },
                {
                    "text": "Yes",
                    handler: () => {
                        console.log("OK");
                    }
                }
            ]
        });
        alert.present();
    }

    mark(state) {
        let alert = this.alertCtrl.create({
            title:"Confirmation",
            message:"Are you sure you want to <strong>" + (state ? "mark" : "unmark") + "</strong> as owned " + this.pokemons.length + " Pokemons",
            buttons: [
                {
                    "text": "No",
                    "role": "cancel"
                },
                {
                    "text": "Yes",
                    handler: () => {
                        this.pokemons.forEach(single_pokemon => {
                            this.pokedex.pokemons[single_pokemon.number]['own'] = state;
                        });
                        this.pokedex.save();
                    }
                }
            ]
        });
        alert.present();
    }

}
