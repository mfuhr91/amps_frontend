"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsuariosService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("../../environments/environment");
var UsuariosService = /** @class */ (function () {
    function UsuariosService(http) {
        this.http = http;
        this.url = environment_1.environment.url + "/usuarios";
    }
    UsuariosService.prototype.getRoles = function () {
        return this.http.get(this.url + "/roles");
    };
    UsuariosService.prototype.getRol = function (id) {
        return this.http.get(this.url + "/roles/" + id);
    };
    UsuariosService.prototype.getUsuarios = function () {
        return this.http.get("" + this.url);
    };
    UsuariosService.prototype.getUsuario = function (id) {
        return this.http.get(this.url + "/editar/" + id);
    };
    UsuariosService.prototype.crearUsuario = function (usuario) {
        return this.http.post(this.url + "/crear", usuario);
    };
    UsuariosService.prototype.editarUsuario = function (usuario) {
        return this.http.put(this.url + "/editar", usuario);
    };
    UsuariosService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], UsuariosService);
    return UsuariosService;
}());
exports.UsuariosService = UsuariosService;
