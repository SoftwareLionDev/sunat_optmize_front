import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Funtions } from '../src/funtions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public form!: FormGroup;
  
  constructor(
    private form_builder: FormBuilder,
    private s_user: UserService,
    private fn: Funtions,
    private router: Router
  ){

  }

  ngOnInit(){
    this.create_form();
  }

  login(){
    
    this.s_user.login(this.form.value).subscribe(r => {
      if(!r.success){
        return this.fn.message_error(r.message);
      }

      console.log('oasds');
      
      this.router.navigate(['/dashboard']);
    });
  }

  create_form(){
    this.form = this.form_builder.group({
      mail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
