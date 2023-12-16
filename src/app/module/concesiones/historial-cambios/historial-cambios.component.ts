import { ViewportRuler } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-historial-cambios',
  templateUrl: './historial-cambios.component.html',
  styleUrls: ['./historial-cambios.component.css']
})
export class HistorialCambiosComponent {
  public displayedColumns: string[] = ['usuario', 'estado', 'fecha', 'departamento', 'codigo', 'proveedor', 'personal'];
  public dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Factura Electronica', weight: 1.0079, symbol: 'El codigo de Local anexo  Consignado no se encuentra ' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 1, name: 'Factura Electronica', weight: 1.0079, symbol: 'El codigo de Local anexo  Consignado no se encuentra ' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },

];



