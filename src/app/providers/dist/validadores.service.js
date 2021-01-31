"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ValidadoresService = void 0;
var core_1 = require("@angular/core");
var ValidadoresService = /** @class */ (function () {
    function ValidadoresService() {
    }
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
    ValidadoresService.prototype.distintoCero = function (id) {
        return function (control) {
            var noCero = id.test(control.value);
            return noCero ? { distintoCero: { value: control.value } } : null;
        };
    };
    ValidadoresService.prototype.passwordsIguales = function (pass1, pass2) {
        return function (formGroup) {
            var pass1Control = formGroup.controls[pass1];
            var pass2Control = formGroup.controls[pass2];
            if (pass1Control.value === pass2Control.value) {
                pass2Control.setErrors(null);
            }
            else {
                pass2Control.setValue({ noEsIgual: true });
            }
        };
    };
    ValidadoresService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ValidadoresService);
    return ValidadoresService;
}());
exports.ValidadoresService = ValidadoresService;
