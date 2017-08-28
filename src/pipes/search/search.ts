import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search',
})
export class SearchFilter implements PipeTransform {
    transform(list:Array<Object>, ...args) {
        if (list.length > 0 && args[0] != "") {
            let filtered = list.filter(single_pokemon => {
                return (single_pokemon['current_name'].toLowerCase().indexOf(args[0].toLowerCase()) != -1);
            });
            return (filtered.length > 0 ? filtered : [{'current_number':'000'}]);
        } else {
            return list;
        }
    }
}
