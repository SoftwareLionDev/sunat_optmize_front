import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../materia-module';
import { ListadoUsuariosComponent } from './usuarios/listado-usuarios/listado-usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario/nuevo-usuario.component';
import { RouterModule } from '@angular/router';
import { BienvenidoComponent } from './bienvenido/bienvenido.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ListadoUsuariosComponent,
    NuevoUsuarioComponent,
    BienvenidoComponent
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
