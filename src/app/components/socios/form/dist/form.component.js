"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormComponent = void 0;
var core_1 = require("@angular/core");
var FormComponent = /** @class */ (function () {
    function FormComponent(fb, sociosService, location) {
        this.fb = fb;
        this.sociosService = sociosService;
        this.location = location;
        this.mostrarFoto = false;
        this.crearForm();
        this.cargarDataAlFormulario();
        console.log(this.foto);
    }
    FormComponent.prototype.ngOnChanges = function (changes) {
        this.foto = this.sociosService.getFoto();
    };
    FormComponent.prototype.ngOnInit = function () {
        console.log('DESDE FORM' + this.socio);
    };
    FormComponent.prototype.crearForm = function () {
        this.form = this.fb.group({
            num_doc: [''],
            nombre: [''],
            apellido: [''],
            correo: ['']
        });
    };
    FormComponent.prototype.cargarDataAlFormulario = function () {
        if (this.socio) {
            this.form.setValue(this.socio);
        }
        else {
            this.form.setValue({
                nombre: 'Mariano',
                apellido: 'Fuhr',
                correo: 'mfuhr@mail.com',
                num_doc: 233124124
            });
        }
    };
    FormComponent.prototype.guardar = function () {
        console.log(this.form);
        this.sociosService.crearSocio(this.form.value).subscribe();
    };
    /* verFoto( foto: any) {
  
      alert(`se recibe ${foto}`);
    } */
    FormComponent.prototype.cargarFoto = function (e) {
        this.foto = e;
        console.log(this.foto);
    };
    FormComponent.prototype.volver = function () {
        this.location.back();
    };
    FormComponent.prototype.nInit = function () {
    };
    __decorate([
        core_1.Input()
    ], FormComponent.prototype, "socio");
    FormComponent = __decorate([
        core_1.Component({
            selector: 'app-form',
            templateUrl: './form.component.html',
            styleUrls: ['./form.component.scss']
        })
    ], FormComponent);
    return FormComponent;
}());
exports.FormComponent = FormComponent;
