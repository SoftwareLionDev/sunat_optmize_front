import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Funtions } from 'src/app/src/funtions';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['estado', 'cargo', 'nombre', 'correo', 'usuario', 'Contrasenia', 'activo', 'sinConexion', 'MontoRecarga'];
  public dataSource = new MatTableDataSource<any>([]);
  public dataUsers: any[] = [];
  public value_state_filter: string = 'A';

  constructor(
    private modals: MatDialog,
    private viewportRuler: ViewportRuler,
    public fn: Funtions,
    public users: UserService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.list_User();
  }

  search(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    

    if (window.innerWidth <= 767) {

      this.dataSource.data = this.dataUsers.filter(x => x.id_state.includes(this.value_state_filter));

      this.dataSource.data = this.dataSource.data.filter(item => {
        for (const key in item) {
          if (item[key] && item[key].toString().includes(filterValue)) {
            return true; // Si alguna propiedad contiene el valor, se incluye en el resultado
          }
        }
        return false; // Si ninguna propiedad contiene el valor, se excluye del resultado
      });
    }
    else {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  applyFilter() {
    let data_filter: any[] = this.dataUsers.filter(x => x.id_state.includes(this.value_state_filter));

    this.dataSource.data = data_filter;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  public list_User() {
    this.fn.show_spinner();
    this.users.list_users().subscribe(r => {
      this.fn.hiden_loading();

      if (r.success) {
        this.dataUsers = r.result;
        this.dataSource.data = this.dataUsers;
        this.dataSource.paginator = this.paginator;

        this.applyFilter();
        console.log('holaaaaaaa', this.value_state_filter);
      }
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    }
    );
  }

  public async delete(id_user: number) {
    const response = await this.fn.message_question('¿Desea eliminar el usuario?');

    if(!response) return;

    this.users.delete(id_user).subscribe(r => {
      if(!r.success){
        this.fn.message_error(r.message);
        return;
      }

      this.list_User();
    });
  }

  public async change_state(id_user: number, id_state: string){
    let operation = id_state == 'A' ? 'activar' : 'desactivar';

    let response = await this.fn.message_question(`¿Desea ${operation} el usuario?`);
    
    if(response){
      this.users.change_state(id_user, id_state).subscribe(r => {
        if(!r.success){
          this.fn.message_error(r.message);
          return;
        }
  
        this.list_User();
      });
    }
  }

  public nuevoUsuario(item: any, edit: boolean) {
    const body = {
      edit: edit,
      item: item
    };
    console.log(body);
    const isMobile = this.viewportRuler.getViewportSize().width < 600; // Ajusta el umbral según tus necesidades
    const modalConfig = {
      width: isMobile ? '100%' : '500px',
      height: isMobile ? '100%' : 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: isMobile ? 'mobile-dialog' : 'desktop-dialog',
      data: body,
    };
    
    const dialogRef = this.modals.open(NuevoUsuarioComponent, modalConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result.ok) {
        this.list_User();
      }
    })
  }
}



