import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { DetailPage } from '../../pages/detail/detail';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'pokemons',
    templateUrl: 'pokemons.html'
})

export class Pokemons {

	private master:Array<Object> = [{'aa':'bb'}];
	
	@Input('list')
    set list(list:Array<Object>) {
		console.log(this.master);
        //this.master = list;
        console.log(this.master);
    }

	constructor(public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider, public modalCtrl:ModalController) { }
	
	ionViewDidEnter() {
		console.log("ENTER");
	}
	
	getMaster() {
		return this.master;
	}
	
    virtualScrollTracker(index, pokemon) {
        return pokemon['number'];
    }
    
    selectPokemon(single_pokemon) {
        let modal = this.modalCtrl.create(DetailPage, {'pokemon':single_pokemon, 'parent': this});
        modal.present();
    }

    pokedexChanged() {
        this.pokedex.save();
    }
}
