import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/map';

@Injectable()
export class ConfigProvider {

    private _languages:Array<Object> = [{'suffix':'en', 'name':'English'},{'suffix':'fr', 'name':'French'},{'suffix':'de', 'name':'German'},{'suffix':'es', 'name': 'Spanish'},{'suffix':'jp', 'name':'Japanese'}];

    private _regions:Array<Object> = [{'id':'national', 'name':'National'},{'id':'alola', 'name':'Alola'},{'id':'kanto', 'name':'Kanto'},{'id':'johto', 'name':'Johto'},{'id':'hoenn', 'name':'Hoenn'},{'id':'sinnoh', 'name':'Sinnoh'},{'id':'unova', 'name':'Unova'},{'id':'kalos', 'name':'kalos'}];

    private _filters:Array<Object> = [{
            'id':'own',
            'name':'Own',
            'description':'You have this pokemon',
            'default':false,
            'icon':'cube'
        },{
            'id':'shiny',
            'name':'Shiny',
            'description':'You have this pokemon as a shiny',
            'default':false,
            'icon':'star'
        },{
            'id':'pokeball',
            'name':'Pokeball',
            'description':'You have this pokemon in a correct Pokeball',
            'default':false,
            'icon':'help-buoy'
        },{
            'id':'language',
            'name':'Language',
            'description':'This Pokemon is from the correct region',
            'default':false,
            'icon':'flag'
        },{
            'id':'iv',
            'name':'IV',
            'description':'This Pokemon has correct IVs',
            'default':false,
            'icon':'podium'
        },{
            'id':'original_trainer', 
            'name':'O.T.',
            'description':'You are the Original Trainer of this Pokemon',
            'default':false,
            'icon':'person'
        }];

    private configs:Object = {};

    constructor(public http:Http, public storage:Storage, public events:Events) {
        /* Filters default values */
        this.reset();

    }

    load() {
        return this.storage.get("configs").then(data => {
            if (data != null) {
                let loadedConfig:Object = JSON.parse(data);


                ["filters", "alternate_forms", "region", "language"].forEach(single_filter => {
                    if (loadedConfig[single_filter] != null) {
                        this.configs[single_filter] = Object.assign(this.configs[single_filter], loadedConfig[single_filter]);
                    }
                });

            } else {
                /* Try to load the existing configs from version 1 */
                if (window.localStorage['pokedex.config'] != null) {
                    let previousConfig:Object = JSON.parse(window.localStorage['pokedex.config']);
                    if (previousConfig['pokedex'] != null) {
                        this.configs['region']['selected'] = previousConfig['pokedex'];
                    }
                    if (previousConfig['language'] != null) {
                        this.configs['language']['selected'] = previousConfig['language'];
                    }
                    if (previousConfig['forms'] != null) {
                        this.configs['alternate_forms']['all'] = previousConfig['forms'];
                    }
                    ["own", "shiny", "pokeball", "language", "iv", "original_trainer"].forEach(single_filter => {
                        if (previousConfig[single_filter] != null) {
                            this.configs['filters'][single_filter] = previousConfig[single_filter];
                        }
                    });

                    this.save();
                }
            }
        });
    }

    reset() {
        this.configs = {};

        this.configs['filters'] = {};
        this.getFilters().forEach(single_filter => {
            this.configs['filters'][single_filter['id']] = single_filter['default'];
        });

        this.configs['alternate_forms'] = {'all': false};

        this.configs['region'] = {'selected':'alola'};

        this.configs['language'] = {'selected':'en'};
    }

    save() {
        this.storage.set("configs", JSON.stringify(this.configs));

        this.events.publish('configSaved', this.configs);
    }

    getFilters():Array<Object> {
        return this._filters;
    }

    getLanguages():Array<Object> {
        return this._languages;
    }

    getRegions():Array<Object> {
        return this._regions;
    }

    get alternate_forms():Object {
        return this.configs['alternate_forms'];
    }

    get filters():Object {
        return this.configs['filters'];
    }

    get language():Object {
        return this.configs['language'];
    }

    get region():Object {
        return this.configs['region'];
    }


}
