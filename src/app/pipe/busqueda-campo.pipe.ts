import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaCampo'
})
export class BusquedaCampoPipe implements PipeTransform {

  transform(list: any[], columna: string, text: string): any[] {
    
    if(!text) return list;
    const newList = list.filter(item => String(item[columna]).toUpperCase().includes(text.toUpperCase()));
    return newList;
  }

}
