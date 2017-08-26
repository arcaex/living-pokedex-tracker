import { Component, Input } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { DetailPage } from '../../pages/detail/detail';

import { ConfigProvider } from '../../providers/config/config';
import { DataProvider } from '../../providers/data/data';
import { PokedexProvider } from '../../providers/pokedex/pokedex';

@Component({
    selector: 'pokemon',
    templateUrl: 'pokemon.html'
})

export class Pokemon {

	private pokemon:Object = {};
	
	@Input('data')
    set setData(data:Object) {
        this.pokemon = data;
    }

	constructor(public config:ConfigProvider, public data:DataProvider, public pokedex:PokedexProvider, public modalCtrl:ModalController) { }
	
    pokedexChanged() {
        this.pokedex.save();
    }
}
