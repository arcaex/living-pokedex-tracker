import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'apply',
})
export class FilterPipe implements PipeTransform {
    transform(list:Array<Object>, ...args) {
        if (list.length > 0) {
            let filters = args[0];
            let pokedex = args[1];

            return list.filter(single_pokemon => {
                for (let filter_id in filters) {
                    if (filters[filter_id]) {
                        if (pokedex[single_pokemon['number']][filter_id]) {
                            return false;
                        }
                    }
                }
                return true;
            });
        }
        return list;
    }
}
