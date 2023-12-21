import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ListadoUsuariosComponent } from '../module/usuarios/listado-usuarios/listado-usuarios.component';
import { BienvenidoComponent } from '../module/bienvenido/bienvenido.component';
import { ReporteGuiaComponent } from '../module/reporte-guia/reporte-guia.component';
import { ListadoConcesionesComponent } from '../module/concesiones/listado-concesiones/listado-concesiones.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'bienvenido', component: BienvenidoComponent, data: { displayName: 'Panel de Inicio' } },
      { path: 'dashboard', component: ReporteGuiaComponent, data: { displayName: 'Reporte (Guias)' } },
      { path: 'usuarios', component: ListadoUsuariosComponent, canActivate: [authGuard], data: { displayName: 'Usuarios' } },
      { path: 'concesiones', component: ListadoConcesionesComponent, canActivate: [authGuard], data: { displayName: 'Concesiones' } },
      {
        path: '',
        redirectTo: 'bienvenido',
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
