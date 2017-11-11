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
                let condition = this.pokemon['evolve/condition'];

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
                    this.evolution['item'] = {'name':this.pokemon['evolve/item'], 'sprite':this.pokemon['evolve/item'].replace(' ', '').replace("'", '')};

                    if (this.evolution['action'] == "Holding") {
                        this.evolution['action'] = 'Level Up';
                        this.evolution['helper'] = 'Holding';

                        this.evolution['template'] = ['action', 'pokemon', 'helper', 'item'];
                    } else if (this.evolution['action'] == 'Trade, Holding') {
                        this.evolution['action'] = 'Trade';
                        this.evolution['helper'] = 'Holding';

                        this.evolution['template'] = ['action', 'pokemon', 'helper', 'item'];
                    } else {
                        this.evolution['action'] = 'Use a';
                        this.evolution['helper'] = 'on';

                        this.evolution['template'] = ['action', 'item', 'helper', 'pokemon'];
                    }
                }

                if (this.pokemon['evolve/party'] != undefined) {
                    this.evolution['pokemon2'] = this.data.getPokemon(this.pokemon['evolve/party'].substr(1));
                    this.evolution['helper'] = 'While Having in the Party';

                    this.evolution['template'] = ['action', 'pokemon', 'helper', 'pokemon2'];
                }

                if (this.pokemon['evolve/move'] != undefined) {
                    this.evolution['helper'] = 'Knowing';
                    this.evolution['subvalue'] = 'the Move';
                    this.evolution['value'] = this.pokemon['evolve/move'];
                }

                if (this.evolution['action'] == 'Forced-Trade') {
                    this.evolution['action'] = 'Trade';
                    this.evolution['pokemon2'] = this.data.getPokemon(condition.substr(1));
                    this.evolution['helper'] = 'with';

                    this.evolution['template'] = ['action', 'pokemon', 'helper', 'pokemon2'];

                    condition = undefined;
                }

                this.evolution['conditions'] = [];
                if (this.pokemon['evolve/time'] != undefined) {
                    this.evolution['conditions'].push('At ' + this.pokemon['evolve/time']);
                }
                if (condition != undefined) {
                    this.evolution['conditions'].push(condition);
                }
                if (this.pokemon['evolve/area'] != undefined) {
                    this.evolution['conditions'].push(this.pokemon['evolve/area']);
                }
                if (this.pokemon['evolve/game'] != undefined) {
                    this.evolution['conditions'].push('In the game Pokemon ' + this.pokemon['evolve/game']);
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
