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

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);

    let data_filter: any[] = this.dataUsers.filter(x => x.id_state.includes(filterValue));

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
      }
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    }
    );
  }

  public delete() {
    this.fn.delete_user();
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



