import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ListarCategoriasComponent } from './components/categorias/listar-categorias/listar-categorias.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { FormConveniosComponent } from './components/convenios/form-convenios/form-convenios.component';
import { ListarConveniosComponent } from './components/convenios/listar-convenios/listar-convenios.component';
import { DescuentosComponent } from './components/descuentos/descuentos.component';
import { ExportarDescuentosComponent } from './components/descuentos/exportar-descuentos/exportar-descuentos.component';
import { FormDescuentosComponent } from './components/descuentos/form-descuentos/form-descuentos.component';
import { ListarDescuentosComponent } from './components/descuentos/listar-descuentos/listar-descuentos.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FormSociosComponent } from './components/socios/form-socios/form-socios.component';
import { ListarSociosComponent } from './components/socios/listar-socios/listar-socios.component';
import { SociosComponent } from './components/socios/socios.component';
import { FormUsuariosComponent } from './components/usuarios/form-usuarios/form-usuarios.component';
import { ListarUsuariosComponent } from './components/usuarios/listar-usuarios/listar-usuarios.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ListarVariablesComponent } from './components/variables/listar-variables/listar-variables.component';
import { VariablesComponent } from './components/variables/variables.component';

const routes: Routes = [
  {
    path: 'inicio', 
    component: InicioComponent
  },
  {
    path: 'socios', 
    component: SociosComponent,
    children: [
      {
        path: '', component: ListarSociosComponent
      },
      {
        path: 'crear', 
        component: FormSociosComponent,
      },
      {
        path: 'editar/:id', 
        component: FormSociosComponent,
      },
    ]
  },  
  {
    path: 'convenios', 
    component: ConveniosComponent,
    children: [
      {
        path: '', component: ListarConveniosComponent
      },
      {
        path: 'crear', 
        component: FormConveniosComponent,
      },
      {
        path: 'editar/:id', 
        component: FormConveniosComponent,
      },
    ]
  },
  {
    path: 'categorias', 
    component: CategoriasComponent,
    children: [
      {
        path: '', component: ListarCategoriasComponent
      }
    ]
  },
  {
    path: 'descuentos', 
    component: DescuentosComponent,
    children: [
      {
        path: '', component: ListarDescuentosComponent
      },
      {
        path: 'crear', 
        component: FormDescuentosComponent,
      },
      {
        path: 'editar/:id', 
        component: FormDescuentosComponent,
      },
      {
        path: 'liquidar', 
        component: ExportarDescuentosComponent,
      },
    ]
    
  },
  {
    path: 'variables', 
    component: VariablesComponent,
    children: [
      {
        path: '', component: ListarVariablesComponent
      }
    ]
  },
  {
    path: 'usuarios', 
    component: UsuariosComponent,
    children: [
      {
        path: '', component: ListarUsuariosComponent
      },
      {
        path: 'crear', 
        component: FormUsuariosComponent,
      },
      {
        path: 'editar/:id', 
        component: FormUsuariosComponent,
      },
    ]
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'inicio'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
