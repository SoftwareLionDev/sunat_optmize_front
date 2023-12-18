import { Component, Inject, OnInit, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  public formUser!: FormGroup;
  public list_role: any[] = [];
  mostrarErrores: { [key: string]: boolean } = {};

  constructor(
    private close: MatDialogRef<null>, @Optional() @Inject(MAT_DIALOG_DATA)
    public body: any,
    public fn: Funtions,
    public fb: FormBuilder,
    public users: UserService,

  ) {
    this.CreateFormUser();
    if (body.edit) this.Edit_users();
  }

  ngOnInit(): void {
    this.listRoles();
  }


  listRoles() {
    this.fn.show_spinner();
    this.users.list_role().subscribe(r => {
      this.fn.hiden_loading();
      if (r.success) {
        this.list_role = r.result;
      }
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    });
  }


  private CreateFormUser() {
    this.formUser = this.fb.group({
      id_user: [0],
      id_company: [1],
      id_role: [1],
      id_state: ['A'],
      mail: new FormControl('', [Validators.required, this.emailRegexValidator()]),
      username: ['', Validators.required],
      password: ['', Validators.required],
      full_name: ['', Validators.required],
      receive_all_message: [false],
      receive_without_concession: [false],
    })
  }

  Edit_users() {
    const item: any = this.body.item;
    console.log(this.body.item);
    this.formUser.patchValue({
      id_user: item.id_user,
      id_company: item.id_company,
      id_role: item.id_role,
      id_state: item.id_role,
      mail: item.mail,
      username: item.username,
      password: item.password,
      full_name: item.full_name,
      receive_all_message: item.receive_all_message,
      receive_without_concession: item.receive_without_concession,

    })
  }

  check_field(property: string) {
    const component_Control = this.formUser.get(property);
    return component_Control && component_Control.touched &&
      (component_Control.hasError('required') || component_Control.hasError('invalidEmail'));
  }




  emailRegexValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regex = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
      const valid = regex.test(control.value);
      return valid ? null : { 'invalidEmail': { value: control.value } };
    };
  }


  public saveUser() {
    this.fn.empty_form(this.formUser);
    if (this.formUser.invalid) return;
    this.fn.show_spinner();
    this.users.save_user(this.formUser.value, this.body.edit).subscribe(r => {
      this.fn.hiden_loading();
      if (!r.success) {
        return this.fn.message_error(r.message);
      }
      this.fn.message_information('Usuario Registrado Correctamente');
      this.close.close({ ok: true });
    }, (error) => {
      this.fn.hiden_loading();
      return this.fn.message_error(error.message);
    });
  }
}
