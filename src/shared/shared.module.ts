import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/materia-module';
import { SiderbarComponent } from './siderbar/siderbar.component';



@NgModule({
  declarations: [
    SiderbarComponent
  ],

  exports: [
    SiderbarComponent
  ],

  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]

})
export class SharedModule { }
