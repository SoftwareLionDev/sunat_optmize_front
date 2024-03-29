import { Component, ViewChild } from '@angular/core';
import { NuevaConcesionComponent } from '../nueva-concesion/nueva-concesion.component';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HistorialCambiosComponent } from '../historial-cambios/historial-cambios.component';
import { Funtions } from 'src/app/src/funtions';
import { ConcessionService } from 'src/app/services/concession.service';

@Component({
  selector: 'app-listado-concesiones',
  templateUrl: './listado-concesiones.component.html',
  styleUrls: ['./listado-concesiones.component.css']
})
export class ListadoConcesionesComponent {


  public displayedColumns: string[] = ['estado', 'departamento', 'codigo', 'nombre', 'zona', 'proveedor', 'personal', 'mail', 'MontoRecarga'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public concessions: any[] = [];
  public value_state_filter: string = 'A';

  constructor(
    private modals: MatDialog,
    private viewportRuler: ViewportRuler,
    private fn: Funtions,
    private s_concession: ConcessionService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.list_concession();
  }

  list_concession() {
    this.fn.show_spinner();
    this.s_concession.list().subscribe(r => {
      this.fn.hiden_loading();

      if (r.success) {
        this.concessions = r.result;
        this.dataSource.data = this.concessions;
        this.dataSource.paginator = this.paginator;

        this.filter_state();
      }
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    }
    );
  }

  filter_state() {
    let data_filter: any[] = this.concessions.filter(x => x.id_state.includes(this.value_state_filter));

    this.dataSource.data = data_filter;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportar_excel() {
    const data = this.dataSource.data;

    this.fn.exporto_to_excel(data);
  }

  public new_concession(item: any = null) {
    const modalConfig = {
      panelClass: 'full-screen-modal',
      data: item
    };

    const dialogRef = this.modals.open(NuevaConcesionComponent, modalConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result.ok) {
        this.list_concession();
      }
    });
  }

  public async change_state(id_concession: number, id_state: string) {
    let operation = id_state == 'A' ? 'activar' : 'desactivar';

    let response = await this.fn.message_question(`¿Desea ${operation} la concesión?`);

    if (response) {
      this.s_concession.change_state(id_concession, id_state).subscribe(r => {
        if (!r.success) {
          this.fn.message_error(r.message);
          return;
        }

        this.list_concession();
      });
    }
  }

  public HistorialCambios(id_concession: number) {
    console.log(id_concession);

    const modalConfig = {
      panelClass: 'full-screen-modal-historial',
      data: id_concession
    };

    this.modals.open(HistorialCambiosComponent, modalConfig);
  }

  search(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();

    if (window.innerWidth <= 767) {

      this.dataSource.data = this.concessions.filter(x => x.id_state.includes(this.value_state_filter));

      this.dataSource.data = this.dataSource.data.filter(item => {
        for (const key in item) {
          if (item[key] && item[key].toString().toLowerCase().includes(filterValue)) {
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


  public async delete(id_concession: number) {
    const response = await this.fn.message_question('¿Desea eliminar la concesión?');

    if (!response) return;

    this.s_concession.delete(id_concession).subscribe(r => {
      if (!r.success) {
        this.fn.message_error(r.message);
        return;
      }

      this.list_concession();
    });
  }



}
