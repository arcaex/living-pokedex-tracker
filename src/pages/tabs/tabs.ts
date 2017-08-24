import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { PokedexPage } from '../../pages/pokedex/pokedex';
import { FormsPage } from '../../pages/forms/forms';

@Component({
    templateUrl: 'tabs.html'
})

export class Tabs {
    tabPokedexRoot: any = PokedexPage;
    tabFormsRoot: any = FormsPage;

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
