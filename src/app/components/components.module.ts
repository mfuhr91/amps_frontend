import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { InicioComponent } from './inicio/inicio.component';
import { SociosComponent } from './socios/socios.component';
import { ComerciosComponent } from './comercios/comercios.component';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListarComponent } from './socios/listar/listar.component';

import { WebcamModule } from "ngx-webcam";
import { FormComponent } from './socios/form/form.component';



@NgModule({
  declarations: [
    NavbarComponent, 
    InicioComponent, 
    SociosComponent, 
    ComerciosComponent, 
    ListarComponent,
    FormComponent
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    WebcamModule
  ],
  exports: [
    NavbarComponent,
    InicioComponent, 
    SociosComponent, 
    ComerciosComponent, 
    ListarComponent, 
    FormComponent
  ]
})
export class ComponentsModule { }
