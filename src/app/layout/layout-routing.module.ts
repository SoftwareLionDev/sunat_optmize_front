import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../module/dashboard/dashboard.component';
import { ListadoUsuariosComponent } from '../module/usuarios/listado-usuarios/listado-usuarios.component';
import { BienvenidoComponent } from '../module/bienvenido/bienvenido.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: ListadoUsuariosComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
