import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
    selector: 'page-actions',
    templateUrl: 'actions.html',
})
export class ActionsPage {

    private pokemons:Array<Object> = [];

    constructor(public viewCtrl:ViewController, public navCtrl:NavController, public navParams:NavParams, public alertCtrl:AlertController, public pokedex:PokedexProvider, public config:ConfigProvider, public data:DataProvider, public socialSharing:SocialSharing) {
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
                        /* Version 0.x data */
                        window.localStorage['pokedex.pokemon'] = null;
                        window.localStorage['pokedex.config'] = null;

                        /* Version 1.x data */
                        this.pokedex.reset();
                        this.pokedex.init(this.data.getAllPokemons(), this.config.getFilters());
                        this.pokedex.save();

                        this.config.reset();
                        this.config.save();

                        this.viewCtrl.dismiss();
                    }
                }
            ]
        });
        alert.present();
    }
    
    export() {
        this.socialSharing.share(JSON.stringify(this.pokedex.pokemons), 'Export');
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
                            this.pokedex.pokemons[single_pokemon['number']]['own'] = state;
                        });
                        this.pokedex.save();

                        this.viewCtrl.dismiss();
                    }
                }
            ]
        });
        alert.present();
    }

}
