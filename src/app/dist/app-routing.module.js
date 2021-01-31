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
var categorias_component_1 = require("./components/categorias/categorias.component");
var listar_categorias_component_1 = require("./components/categorias/listar-categorias/listar-categorias.component");
var convenios_component_1 = require("./components/convenios/convenios.component");
var form_convenios_component_1 = require("./components/convenios/form-convenios/form-convenios.component");
var listar_convenios_component_1 = require("./components/convenios/listar-convenios/listar-convenios.component");
var descuentos_component_1 = require("./components/descuentos/descuentos.component");
var exportar_descuentos_component_1 = require("./components/descuentos/exportar-descuentos/exportar-descuentos.component");
var form_descuentos_component_1 = require("./components/descuentos/form-descuentos/form-descuentos.component");
var listar_descuentos_component_1 = require("./components/descuentos/listar-descuentos/listar-descuentos.component");
var inicio_component_1 = require("./components/inicio/inicio.component");
var form_socios_component_1 = require("./components/socios/form-socios/form-socios.component");
var listar_socios_component_1 = require("./components/socios/listar-socios/listar-socios.component");
var socios_component_1 = require("./components/socios/socios.component");
var form_usuarios_component_1 = require("./components/usuarios/form-usuarios/form-usuarios.component");
var listar_usuarios_component_1 = require("./components/usuarios/listar-usuarios/listar-usuarios.component");
var usuarios_component_1 = require("./components/usuarios/usuarios.component");
var listar_variables_component_1 = require("./components/variables/listar-variables/listar-variables.component");
var variables_component_1 = require("./components/variables/variables.component");
var routes = [
    {
        path: 'inicio',
        component: inicio_component_1.InicioComponent
    },
    {
        path: 'socios',
        component: socios_component_1.SociosComponent,
        children: [
            {
                path: '', component: listar_socios_component_1.ListarSociosComponent
            },
            {
                path: 'crear',
                component: form_socios_component_1.FormSociosComponent
            },
            {
                path: 'editar/:id',
                component: form_socios_component_1.FormSociosComponent
            },
        ]
    },
    {
        path: 'convenios',
        component: convenios_component_1.ConveniosComponent,
        children: [
            {
                path: '', component: listar_convenios_component_1.ListarConveniosComponent
            },
            {
                path: 'crear',
                component: form_convenios_component_1.FormConveniosComponent
            },
            {
                path: 'editar/:id',
                component: form_convenios_component_1.FormConveniosComponent
            },
        ]
    },
    {
        path: 'categorias',
        component: categorias_component_1.CategoriasComponent,
        children: [
            {
                path: '', component: listar_categorias_component_1.ListarCategoriasComponent
            }
        ]
    },
    {
        path: 'descuentos',
        component: descuentos_component_1.DescuentosComponent,
        children: [
            {
                path: '', component: listar_descuentos_component_1.ListarDescuentosComponent
            },
            {
                path: 'crear',
                component: form_descuentos_component_1.FormDescuentosComponent
            },
            {
                path: 'editar/:id',
                component: form_descuentos_component_1.FormDescuentosComponent
            },
            {
                path: 'liquidar',
                component: exportar_descuentos_component_1.ExportarDescuentosComponent
            },
        ]
    },
    {
        path: 'variables',
        component: variables_component_1.VariablesComponent,
        children: [
            {
                path: '', component: listar_variables_component_1.ListarVariablesComponent
            }
        ]
    },
    {
        path: 'usuarios',
        component: usuarios_component_1.UsuariosComponent,
        children: [
            {
                path: '', component: listar_usuarios_component_1.ListarUsuariosComponent
            },
            {
                path: 'crear',
                component: form_usuarios_component_1.FormUsuariosComponent
            },
            {
                path: 'editar/:id',
                component: form_usuarios_component_1.FormUsuariosComponent
            },
        ]
    },
    {
        path: '**', pathMatch: 'full', redirectTo: 'usuarios'
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
