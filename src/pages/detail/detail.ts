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

    private segment:String = "info";

    private breedingPokemons:Array<Object> = [];

    private evolution:Object = {};

    constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider) {
        this.pokemon = this.navParams.get("pokemon");

        /* Get the Pokemon info for the breeding */
        if (this.pokemon['breeding'] != undefined) {
            let matches = this.pokemon['breeding'].match(/#([0-9a-zA-Z-]+)/g);
            matches.forEach(single_match => {
                this.breedingPokemons.push(this.data.getPokemon(single_match.substr(1)));
            });
        }

        /* Build the evolution info */
        if (this.pokemon['evolve/pokemon'] != undefined) {
            let matches = this.pokemon['evolve/pokemon'].match(/#([0-9a-zA-Z-]+)/g);
            if (matches.length > 0) {
                this.evolution['template'] = ['action', 'pokemon', 'helper', 'value'];

                this.evolution['action'] = this.pokemon['evolve/action'];
                if (this.evolution['action'] == undefined) {
                    this.evolution['action'] = 'Level Up';
                }
                this.evolution['pokemon'] = this.data.getPokemon(matches[0].substr(1));

                if (this.pokemon['evolve/level'] != undefined) {
                    this.evolution['helper'] = 'to';
                    this.evolution['subvalue'] = 'level';
                    this.evolution['value'] = this.pokemon['evolve/level'];
                }

                if (this.pokemon['evolve/trait'] != undefined) {
                    this.evolution['helper'] = 'with';
                    this.evolution['value'] = 'Max';
                    this.evolution['supvalue'] = this.pokemon['evolve/trait'];
                }

                if (this.pokemon['evolve/item'] != undefined) {
                    this.evolution['action'] = 'Use a';
                    this.evolution['helper'] = 'on';

                    this.evolution['item'] = {'name':this.pokemon['evolve/item'], 'sprite':this.pokemon['evolve/item'].replace(' ', '')};

                    this.evolution['template'] = ['action', 'item', 'helper', 'pokemon'];
                }

                this.evolution['conditions'] = [];
                if (this.pokemon['evolve/time'] != undefined) {
                    this.evolution['conditions'].push('At ' + this.pokemon['evolve/time']);
                }

            }
        }
        console.log(this.pokemon);
        console.log(this.evolution);

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
