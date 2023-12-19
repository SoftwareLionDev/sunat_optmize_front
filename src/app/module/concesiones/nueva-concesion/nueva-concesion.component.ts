import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConcessionService } from 'src/app/services/concession.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-nueva-concesion',
  templateUrl: './nueva-concesion.component.html',
  styleUrls: ['./nueva-concesion.component.css']
})
export class NuevaConcesionComponent {
  public form_concession!: FormGroup;
  public departments: any[] = [];
  public users: any[] = [];

  constructor(
    public fn: Funtions,
    private s_department: DepartmentService,
    private s_user: UserService,
    public fb: FormBuilder,
    private s_concession: ConcessionService,
    private dialog: MatDialogRef<null>,
    @Optional() @Inject(MAT_DIALOG_DATA) public body: any,
  ){
    this.create_form();

    if(body){
      this.load_concession();
    }
  }

  ngOnInit(): void {
    this.list_select();

    console.log(this.body);
  }

  check_field(property: string) {
    const component_Control = this.form_concession.get(property);
    return component_Control && component_Control.touched &&
      (component_Control.hasError('required') || component_Control.hasError('invalidEmail'));
  }

  load_concession(){
    this.form_concession.patchValue({
      id_concession: this.body.id_concession,
      id_department: this.body.id_department,
      code: this.body.code,
      name: this.body.name,
      zone: this.body.zone,
      nro_supplier: this.body.nro_supplier,
      id_user_assigned: this.body.id_user_assigned
    });
  }

  save_concession(){
    this.fn.empty_form(this.form_concession);
    if (this.form_concession.invalid) return;
    this.fn.show_spinner();
   
    const update = !this.body ? false : true;
    this.s_concession.save(this.form_concession.value, update).subscribe(r => {
      this.fn.hiden_loading();
      if (!r.success) {
        return this.fn.message_error(r.message);
      }
      this.fn.message_information('Usuario Registrado Correctamente');
      this.dialog.close({ ok: true });
    }, (error) => {
      this.fn.hiden_loading();
      return this.fn.message_error(error.message);
    });
  }

  list_select(){
    this.s_department.list().subscribe(r => {
      if (r.success) {
        this.departments = r.result;
      }
    }, (error) => {
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    });

    this.s_user.list_users().subscribe(r => {
      if(r.success){
        this.users = r.result.filter((x: any) => x.id_state == 'A');
      }
    })
  }


  private create_form() {
    this.form_concession = this.fb.group({
      id_concession: [0],
      id_department: [0],
      code: ['', Validators.required],
      name: ['', Validators.required],
      zone: ['', Validators.required],
      nro_supplier: ['', Validators.required],
      id_user_assigned: [false]
    });
  }
}
