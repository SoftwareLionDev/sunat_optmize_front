import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConcessionService } from 'src/app/services/concession.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-historial-cambios',
  templateUrl: './historial-cambios.component.html',
  styleUrls: ['./historial-cambios.component.css']
})
export class HistorialCambiosComponent {
  public displayedColumns: string[] = ['usuario', 'estado', 'fecha', 'departamento', 'codigo', 'proveedor', 'zone', 'nro_proveedores', 'personal'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public history: any[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private s_concession: ConcessionService,
    public fn: Funtions
  ) { }

  ngOnInit(){
    this.s_concession.list_log(this.data).subscribe(r => {
      this.history = r.result;
      this.dataSource.data = this.history;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  search(event: Event) {
    let filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();

    if (window.innerWidth <= 767) {

      this.dataSource.data = this.history;

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
}

