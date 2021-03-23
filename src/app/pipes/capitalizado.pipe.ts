import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizado'
})
export class CapitalizadoPipe implements PipeTransform {

  transform(value: string | null ): string {

    if( value ) {
      value = value.charAt(0).toUpperCase() + value.substr(1);
      
      return value;

    } else {

      return '';
    }
   
  }

}
