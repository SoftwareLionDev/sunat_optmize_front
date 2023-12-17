import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NuevoUsuarioComponent } from '../nuevo-usuario/nuevo-usuario.component';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { ListUsersService } from 'src/app/services/list-users.service';
import { Funtions } from 'src/app/src/funtions';
import { HttpClient } from '@angular/common/http';
import { QuestionComponent } from 'src/app/components/question/question.component';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['estado', 'cargo', 'nombre', 'correo', 'usuario', 'Contrasenia', 'activo', 'sinConexion', 'MontoRecarga'];
  public dataSource = new MatTableDataSource<any>([]);

  constructor(
    private modals: MatDialog,
    private viewportRuler: ViewportRuler,
    private listUsers: ListUsersService,
    public fn: Funtions
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

  public list_User() {
    this.fn.show_spinner();
    this.listUsers.list_users().subscribe(r => {
      this.fn.hiden_loading();
      if (r.success) {
        this.dataSource.data = r.result;
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

  public nuevoUsuario() {
    const isMobile = this.viewportRuler.getViewportSize().width < 600; // Ajusta el umbral según tus necesidades
    const modalConfig = {
      width: isMobile ? '100%' : '500px',
      height: isMobile ? '100%' : 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
      panelClass: isMobile ? 'mobile-dialog' : 'desktop-dialog',
    };

    this.modals.open(NuevoUsuarioComponent, modalConfig);
  }
}



