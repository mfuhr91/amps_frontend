"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ListarUsuariosComponent = void 0;
var core_1 = require("@angular/core");
var ListarUsuariosComponent = /** @class */ (function () {
    function ListarUsuariosComponent(usuariosService) {
        this.usuariosService = usuariosService;
        this.usuarios = [];
    }
    ListarUsuariosComponent.prototype.ngOnInit = function () {
        this.getUsuarios();
    };
    ListarUsuariosComponent.prototype.getUsuarios = function () {
        var _this = this;
        this.usuariosService.getUsuarios().subscribe(function (res) {
            console.log(res);
            _this.usuarios = res;
        });
    };
    ListarUsuariosComponent.prototype.buscar = function (param) {
    };
    ListarUsuariosComponent.prototype.borrarUsuario = function (usuario) {
    };
    ListarUsuariosComponent = __decorate([
        core_1.Component({
            selector: 'app-listar-usuarios',
            templateUrl: './listar-usuarios.component.html',
            styleUrls: ['./listar-usuarios.component.scss']
        })
    ], ListarUsuariosComponent);
    return ListarUsuariosComponent;
}());
exports.ListarUsuariosComponent = ListarUsuariosComponent;
