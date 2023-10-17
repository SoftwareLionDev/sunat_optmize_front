import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { AlertComponent } from './alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    LoadingComponent,
    AlertComponent
  ],

  exports: [
    LoadingComponent,
    AlertComponent
  ]
  ,
  imports: [
    CommonModule,
    NgxSpinnerModule,
  ]
})
export class ComponentsModule { }
