import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComerciosComponent } from './components/comercios/comercios.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FormComponent } from './components/socios/form/form.component';
import { ListarComponent } from './components/socios/listar/listar.component';
import { SociosComponent } from './components/socios/socios.component';

const routes: Routes = [
  {
    path: 'crear', 
    component: FormComponent,
  },
  {
    path: 'inicio', 
    component: InicioComponent
  },
  {
    path: 'socios', 
    component: SociosComponent,
    children: [
      {
        path: '', component: ListarComponent
      },
      {
        path: 'crear', 
        component: FormComponent,
      },
      {
        path: 'editar/:id', 
        component: FormComponent,
      },
    ]
  },
  
  {
    path: 'comercios', component: ComerciosComponent
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'crear'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
