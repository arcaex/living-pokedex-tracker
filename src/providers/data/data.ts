import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ConfigProvider } from '../config/config';
import { PokedexProvider } from '../pokedex/pokedex';

@Injectable()
export class DataProvider {

    private pokemons:Array<Object> = [];
    private alternate_forms:Array<Object> = [];

    private master:Array<Object> = [];

    constructor(public http:Http, public config:ConfigProvider, public pokedex:PokedexProvider) { }

    load() {
        return this.http.get('assets/json/data.json').toPromise().then(res => {
            this.parse(res.json());
            return Promise.resolve(true);
        });
    }

    loadCSV(filename) {
        return this.http.get('assets/csv/' + filename + '.csv').toPromise().then(res => {
            console.log( this.CSVToArray(res) );
            return Promise.resolve(true);
        });
    }

    refresh() {
        /* Filter the list */
        this.master = this.pokemons.filter(single_pokemon => {
            if (this.config.region['selected'] != 'national') {
                if (single_pokemon['regions'][this.config.region['selected']] == null) {
                    return false;
                }
            }

            for (let filter_id in this.config.filters) {
                if (this.config.filters[filter_id]) {
                    if (this.pokedex.pokemons[single_pokemon['number']][filter_id]) {
                        return false;
                    }
                }
            };

            return true;
        });

        /* Add alternate forms (if they are in the master list) */
        if (this.config.alternate_forms['all']) {
            this.alternate_forms.forEach(single_form => {
                let existingPokemon = this.master.filter(single_pokemon => (single_pokemon['number'] == single_form['origin_number']));
                existingPokemon.forEach(single_pokemon => {
                    let newPokemon = Object.create(single_pokemon);
                    newPokemon.number = single_form['number'];
                    newPokemon.form_name = single_form['names']['en'];
                    newPokemon.origin_number = single_form['origin_number'];
                    this.master.push(newPokemon);
                });
            });
        }

        /* Update the field */
        this.master.forEach(single_pokemon => {
            single_pokemon['current_number'] = (single_pokemon['origin_number'] != null ? single_pokemon['origin_number'] : single_pokemon['number']);
            if (this.config.region['selected'] != 'national') {
                single_pokemon['current_number'] = single_pokemon['regions'][this.config.region['selected']];
            }

            single_pokemon['current_name'] = single_pokemon['names']['en'];
            if (single_pokemon['names'][this.config.language['selected']]) {
                single_pokemon['current_name'] = single_pokemon['names'][this.config.language['selected']];
            }

            single_pokemon['sprite'] = 'pokemon-' + single_pokemon['number'];

            if (single_pokemon['form_name'] != null && this.config.alternate_forms['all']) {
                single_pokemon['current_name'] += ' - ' + single_pokemon['form_name'];
            }
        });

        this.master.forEach(single_pokemon => {
            single_pokemon['current_evolution'] = single_pokemon['evolution'];
            var evolution = single_pokemon['current_evolution'];
            if (evolution != '' && evolution != undefined) {
                var matches = evolution.match(/#([0-9]+)/g);
                if (matches != null) {
                    for (var m=0; m<matches.length; m++) {
                        var number = matches[m];
                        this.master.forEach(named_pokemon => {
                            if (named_pokemon['number'] == number.substr(1)) {
                                evolution = evolution.replace(number, named_pokemon['current_name']);
                            }
                        });
                    }

                    single_pokemon['current_evolution'] = evolution;
                }
            }
        });

        /* Order the list */
		this.master.sort(function(a, b) {
            if (a['current_number'] < b['current_number'])
                return -1;
            if (a['current_number'] > b['current_number'])
                return 1;
            return (a['current_name'] < b['current_name'] ? -1 : 1);
		});
    }

    private parse(json:Array<any>) {
        this.pokemons = json['pokemons'];
        this.alternate_forms = json['alternate_forms'];

        this.refresh();
    }


    private CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    }

    getPokemons() {
        return this.master;
    }
}
