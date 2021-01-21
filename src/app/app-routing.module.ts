import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { FormConveniosComponent } from './components/convenios/form-convenios/form-convenios.component';
import { ListarConveniosComponent } from './components/convenios/listar-convenios/listar-convenios.component';
import { DescuentosComponent } from './components/descuentos/descuentos.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FormSociosComponent } from './components/socios/form-socios/form-socios.component';
import { ListarSociosComponent } from './components/socios/listar-socios/listar-socios.component';
import { SociosComponent } from './components/socios/socios.component';

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
    path: 'categorias', component: CategoriasComponent
  },
  {
    path: 'descuentos', component: DescuentosComponent
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
