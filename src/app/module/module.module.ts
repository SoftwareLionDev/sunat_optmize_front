import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../materia-module';
import { ListadoUsuariosComponent } from './usuarios/listado-usuarios/listado-usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario/nuevo-usuario.component';
import { RouterModule } from '@angular/router';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';
import { ReporteGuiaComponent } from './reporte-guia/reporte-guia.component';
import { ListadoConcesionesComponent } from './concesiones/listado-concesiones/listado-concesiones.component';
import { NuevaConcesionComponent } from './concesiones/nueva-concesion/nueva-concesion.component';
import { HistorialCambiosComponent } from './concesiones/historial-cambios/historial-cambios.component';



@NgModule({
  declarations: [
    ListadoUsuariosComponent,
    NuevoUsuarioComponent,
    BienvenidoComponent,
    ReporteGuiaComponent,
    ListadoConcesionesComponent,
    NuevaConcesionComponent,
    HistorialCambiosComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    ComponentsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ]
})
export class ModuleModule { }