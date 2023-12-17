import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListUsersService } from 'src/app/services/list-users.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  public formUser!: FormGroup;
  public list_role: any;

  constructor(
    private listUsers: ListUsersService,
    public fn: Funtions,
    public fb: FormBuilder,
  ) {
    this.CreateFormUser();
  }
  ngOnInit(): void {
    this.listRoles();
  }

  public listRoles() {
    this.fn.show_spinner();
    this.listUsers.list_users().subscribe(r => {
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
      id_user: [1],
      id_company: [1],
      id_role: [1],
      id_state: ['A'],
      mail: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      full_name: ['', Validators.required],
      notify: [true],
      receive_all_message: [false],
      receive_without_concession: [false],
      role_name: ['', Validators.required]
    })
  }

  public saveUser() {
    this.fn.show_spinner();
    this.listUsers.list_users().subscribe(r => {
      this.fn.hiden_loading();
      if (r.success) {
        // this.list_role = r.result;
      }
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    });
  }
}
