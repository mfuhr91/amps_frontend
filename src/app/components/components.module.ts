import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { InicioComponent } from './inicio/inicio.component';
import { SociosComponent } from './socios/socios.component';
import { ConveniosComponent } from './convenios/convenios.component';
import { FormSociosComponent } from './socios/form-socios/form-socios.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListarSociosComponent } from './socios/listar-socios/listar-socios.component';

import { WebcamModule } from "ngx-webcam";
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CategoriasComponent } from './categorias/categorias.component';
import { DescuentosComponent } from './descuentos/descuentos.component';
import { ListarConveniosComponent } from './convenios/listar-convenios/listar-convenios.component';
import { FormConveniosComponent } from './convenios/form-convenios/form-convenios.component';
import { ListarCategoriasComponent } from './categorias/listar-categorias/listar-categorias.component';
import { FormCategoriasComponent } from './categorias/form-categorias/form-categorias.component';
import { FormDescuentosComponent } from './descuentos/form-descuentos/form-descuentos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ListarUsuariosComponent } from './usuarios/listar-usuarios/listar-usuarios.component';
import { FormUsuariosComponent } from './usuarios/form-usuarios/form-usuarios.component';





@NgModule({
  declarations: [
    NavbarComponent, 
    InicioComponent, 
    SociosComponent, 
    ListarSociosComponent,
    FormSociosComponent,
    ConveniosComponent,
    CategoriasComponent,
    DescuentosComponent,
    ListarConveniosComponent,
    FormConveniosComponent,
    ListarCategoriasComponent,
    FormCategoriasComponent,
    FormDescuentosComponent,
    UsuariosComponent,
    ListarUsuariosComponent,
    FormUsuariosComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    WebcamModule,
    ScrollingModule
  ],
  exports: [
    NavbarComponent,
    InicioComponent 
  ]
})
export class ComponentsModule { }
