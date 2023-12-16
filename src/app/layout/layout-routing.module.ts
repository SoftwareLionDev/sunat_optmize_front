import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ListadoUsuariosComponent } from '../module/usuarios/listado-usuarios/listado-usuarios.component';
import { BienvenidoComponent } from '../module/bienvenido/bienvenido.component';
import { ReporteGuiaComponent } from '../module/reporte-guia/reporte-guia.component';
import { ListadoConcesionesComponent } from '../module/concesiones/listado-concesiones/listado-concesiones.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent },
      { path: 'dashboard', component: ReporteGuiaComponent },
      { path: 'usuarios', component: ListadoUsuariosComponent },
      { path: 'concesiones', component: ListadoConcesionesComponent },
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
