import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], terms: string, tag: string, tag2: string): any[] {
    if (!items) return [];
    if (!terms) return items;
    terms = terms.toLowerCase();
    return items.filter(it => {
      return (it[tag].toLowerCase() + it[tag2].toLowerCase()).includes(terms);
    });
  }
}
