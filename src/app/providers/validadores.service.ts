import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  /* validarSelect( id: number){

    console.log(id);
    

    return (option: FormGroup) => {
  
      if( id != 0){
        option.setErrors(null);
      }else {
        option.setValue({ noSeleccionado: true });
      }
    }
  } */
  distintoCero(id: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const noCero = id.test(control.value);
      return noCero ? {distintoCero: {value: control.value}} : null;
    };
  }
}
