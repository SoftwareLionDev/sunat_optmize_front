import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Funtions } from '../src/funtions';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config';

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
    private router: Router,
    private http: HttpClient
  ) {

  }

  async ngOnInit() {

    let r_config = await this.http.get('assets/config.json').toPromise();

    console.log('holaaa');
    let config = r_config as { apiUrl: string };
    console.log(config.apiUrl);

    AppConfig.url_api = config.apiUrl;


    // const session_ls = this.s_user.session_ls();

    // if (session_ls) {
    //   this.router.navigate(['/dashboard']);
    //   return;
    // }

    this.create_form();

    document.getElementById('usuario')?.focus();

    const ls_configuration = this.fn.get_ls_configuration();

    if (ls_configuration && ls_configuration.remember) {
      this.form.patchValue({
        mail: ls_configuration.mail,
        password: ls_configuration.password,
        remember: true
      })
    }
  }

  // login() {
  //   if (this.form.invalid) return;

  //   this.fn.show_spinner();

  //   this.s_user.login(this.form.value).subscribe(r => {
  //     this.fn.hiden_loading();

  //     if (!r.success) {
  //       return this.fn.message_error(r.message);
  //     }

  //     localStorage.setItem('session', JSON.stringify(r.result));

  //     let checked = this.form.value.remember;

  //     this.fn.set_ls_configuration(checked, this.form.value.mail, this.form.value.password);

  //     this.router.navigate(['/dashboard']);
  //   }, (error) => {
  //     this.fn.hiden_loading();
  //     return this.fn.message_error(error.message);
  //   });
  // }

  check_field(property: string) {
    const component_Control = this.form.get(property);
    return component_Control && component_Control.hasError('required') && component_Control.touched;
  }

  create_form() {
    this.form = this.form_builder.group({
      mail: ['', Validators.required],
      password: ['', Validators.required],
      remember: false
    });
  }
}
