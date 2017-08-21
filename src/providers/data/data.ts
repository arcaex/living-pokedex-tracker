import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataProvider {

    private pokemons:Array<Object> = [];
    private alternate_forms:Array<Object> = [];

    constructor(public http: Http) {
    }

    load() {
        return this.http.get('assets/json/data.json').toPromise().then(res => {
            this.parse(res.json());
            return Promise.resolve(true);
        });
    }

    private parse(json:Array<any>) {
        this.pokemons = json['pokemons'];
        this.alternate_forms = json['alternate_forms'];
    }

    getPokemons() {
        return this.pokemons;
    }
}
