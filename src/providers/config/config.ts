import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class ConfigProvider {

    private languages:Object = {
        'en':'English',
        'fr':'French',
        'de':'German',
        'es':'Spanish',
        'jp':'Japanese',
    };

    private regions:Object = {
        'national':'National',
        'alola':'Alola',
        'kanto':'Kanto',
        'johto':'Johto',
        'hoenn':'Hoenn',
        'sinnoh':'Sinnoh',
        'unova':'Unova',
        'kalos':'kalos',
    };

    private filters:Object = {
        'own': {
            'label':'Own',
            'description':'You have this pokemon',
            'default':false,
            'icon':'ion-cube'
        },
        'shiny': {
            'label':'shiny',
            'description':'You have this pokemon as a shiny',
            'default':false,
            'icon':'ion-star'
        },
        'pokeball': {
            'label':'pokeball',
            'description':'You have this pokemon in a correct Pokeball',
            'default':false,
            'icon':'ion-record'
        },
        'language': {
            'label':'language',
            'description':'This Pokemon is from the correct region',
            'default':false,
            'icon':'ion-flag'
        },
        'iv': {
            'label':'iv',
            'description':'This Pokemon has correct IVs',
            'default':false,
            'icon':'ion-connection-bars'
        },
        'original_trainer': {
            'label':'original_trainer',
            'description':'You are the Original Trainer of this Pokemon',
            'default':false,
            'icon':'ion-person'
        },
    };

    private configs:Object = {};

    constructor(public http:Http, public storage:Storage) {
        console.log('Hello ConfigProvider Provider');
        console.log( storage.driver );
        console.log(window.localStorage['pokedex.pokemon']);
        storage.set("def", "ghi");
        storage.get('pokemon').then((val) => {
            console.log("pokemon");
            console.log(val);
        });
        storage.get('config').then((val) => {
            console.log("config");
            console.log(val);
        });
    }

}
