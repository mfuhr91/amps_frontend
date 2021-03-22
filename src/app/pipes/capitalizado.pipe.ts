import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizado'
})
export class CapitalizadoPipe implements PipeTransform {

  transform(value: string ): string | null {
   
    value = value.charAt(0).toUpperCase() + value.substr(1);
    
    return value;
  }

}
