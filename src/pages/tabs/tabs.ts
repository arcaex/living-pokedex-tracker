import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { PokemonsPage } from '../../pages/pokemons/pokemons';

@Component({
    templateUrl: 'tabs.html'
})

export class Tabs {
    tabPokemonsRoot: any = PokemonsPage;

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
