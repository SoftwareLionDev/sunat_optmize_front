import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { AlertComponent } from './alert/alert.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from '../materia-module';
import { QuestionComponent } from './question/question.component';



@NgModule({
  declarations: [
    LoadingComponent,
    AlertComponent,
    QuestionComponent
  ],

  exports: [
    LoadingComponent,
    AlertComponent,
    QuestionComponent
  ]
  ,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MaterialModule
  ]
})
export class ComponentsModule { }
