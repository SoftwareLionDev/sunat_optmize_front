import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertComponent } from '../components/alert/alert.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  anulado = false;
  public displayedColumnsOptimize: string[] = ['date', 'type', 'Numeration', 'dateTime', 'Transmitter', 'BusinessName', 'status', 'see', 'options'];
  public dataSourceOptimize = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public modals: MatDialog) { }

  openModalAnulado() {
    this.anulado = true;
  }

  closeModalAnulado() {
    this.anulado = false;
  }
  ngAfterViewInit() {
    this.dataSourceOptimize.paginator = this.paginator;
  }

  pdf() {
    window.print();
  }

  public msgAlert() {
    this.modals.open(AlertComponent, {
      width: '560px'
    })
  }



  async ngOnInit(): Promise<void> {

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
  { position: 1, name: 'Factura Electronica', weight: 1.0079, symbol: 'El codigo de Local anexo  Consignado no se encuentra ' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 1, name: 'Factura Electronica', weight: 1.0079, symbol: 'El codigo de Local anexo  Consignado no se encuentra ' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'El codigo de Local anexo  Consignado no se encuentra' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
];

