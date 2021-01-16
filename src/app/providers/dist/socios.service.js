"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SociosService = void 0;
var core_1 = require("@angular/core");
var SociosService = /** @class */ (function () {
    function SociosService(http) {
        this.http = http;
        this.formData = new FormData();
        this.socios = [];
        this.url = 'http://localhost:8080/socios';
    }
    SociosService.prototype.getSocios = function () {
        return this.http.get(this.url);
    };
    SociosService.prototype.getSocio = function (id) {
        return this.http.get(this.url + "/editar/" + id);
    };
    SociosService.prototype.crearSocio = function (socio) {
        return this.http.post(this.url + "/crear", socio);
    };
    SociosService.prototype.subirImagen = function (img) {
        this.formData.append('foto', img);
        return this.http.post(this.url + "/subir_foto", this.formData);
    };
    SociosService.prototype.getFoto = function () {
        return this.foto;
    };
    SociosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], SociosService);
    return SociosService;
}());
exports.SociosService = SociosService;
