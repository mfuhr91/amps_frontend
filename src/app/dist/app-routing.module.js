"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var comercios_component_1 = require("./components/comercios/comercios.component");
var inicio_component_1 = require("./components/inicio/inicio.component");
var crear_component_1 = require("./components/socios/crear/crear.component");
var editar_component_1 = require("./components/socios/editar/editar.component");
var foto_component_1 = require("./components/socios/foto/foto.component");
var listar_component_1 = require("./components/socios/listar/listar.component");
var socios_component_1 = require("./components/socios/socios.component");
var routes = [
    {
        path: 'foto', component: foto_component_1.FotoComponent
    },
    {
        path: 'inicio',
        component: inicio_component_1.InicioComponent
    },
    {
        path: 'socios',
        component: socios_component_1.SociosComponent,
        children: [
            {
                path: '', component: listar_component_1.ListarComponent
            },
            {
                path: 'crear',
                component: crear_component_1.CrearComponent,
                children: [
                    {
                        path: 'foto', component: foto_component_1.FotoComponent
                    },
                ]
            },
            {
                path: 'editar/:id',
                component: editar_component_1.EditarComponent
            },
        ]
    },
    {
        path: 'comercios', component: comercios_component_1.ComerciosComponent
    },
    {
        path: '**', pathMatch: 'full', redirectTo: 'foto'
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes, { useHash: true })],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
