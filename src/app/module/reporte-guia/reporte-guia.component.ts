import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AlertComponent } from '../../components/alert/alert.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GuideService } from '../../services/guide.service';
import { Funtions } from '../../src/funtions';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config';

@Component({
  selector: 'app-reporte-guia',
  templateUrl: './reporte-guia.component.html',
  styleUrls: ['./reporte-guia.component.css']
})
export class ReporteGuiaComponent {
  year: number = new Date().getFullYear();

  anulado = false;
  public displayedColumnsOptimize: string[] = ['date', 'type', 'Numeration', 'dateTime', 'Transmitter', 'BusinessName', 'status', 'see', 'options'];
  public dataSourceOptimizeAll = new MatTableDataSource<any>([]);
  public dataSourceOptimize = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public current_date = '';
  public info_sync: any;
  public pdf_64: string = '';

  constructor(
    public modals: MatDialog,
    private s_user: UserService,
    private router: Router,
    private s_guide: GuideService,
    public fn: Funtions,
    private http: HttpClient
  ) {
    const date = new Date();
    this.current_date = this.fn.convert_date(date, 'yyyy-mm-dd');
    this.current_date = this.current_date + 'T00:00:00';
    console.log(this.current_date);
  }

  async ngOnInit(): Promise<void> {
    let r_config = await this.http.get('assets/config.json').toPromise();
    let config = r_config as { apiUrl: string };
    AppConfig.url_api = config.apiUrl;


  }

  ngAfterViewInit() {
    document.getElementById('search')?.click();
  }

  public msg_content(code_message: string, url: string) {
    this.modals.open(AlertComponent, {
      width: '560px',
      data: {
        code_message,
        url
      }
    })
  }

  exportar_excel() {
    const data = this.dataSourceOptimize.data;
    const data_excel = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      data_excel.push({
        fecha_mensaje: element.fecPublica,
        tipo_gre: element.type_gre,
        numeracion: element.numeration,
        fecha_emision: element.datetime_issue.replace('.000Z', '').replace('T', ' '),
        ruc_emisor: element.ruc_issuer,
        razon_social: element.business_name,
        estado: element.description_code,
        baja_descripcion: element.sub_status,
        fecha_baja: element.date_low
      });
    }
    this.fn.exporto_to_excel(data_excel);
  }

  btn_search(start_date: string, end_date: string, type_guide: string, summary: boolean, filter_value: string) {
    // this.dataSourceOptimize = new MatTableDataSource<any>(ELEMENT_DATA);
    // this.dataSourceOptimize.paginator = this.paginator;
    // return;


    this.fn.show_spinner();

    this.s_guide.list(this.fn.date_db(start_date), this.fn.date_db(end_date), type_guide, summary).subscribe(r => {
      this.fn.hiden_loading();

      if (!r.success) {
        this.dataSourceOptimize = new MatTableDataSource<any>([]);
        this.fn.message_error(r.message.includes('Failed to connect to') ? 'Error al conectar con el servidor' : r.message);
        return;
      }

      console.log(r.result.data);
      this.dataSourceOptimize = new MatTableDataSource<any>(r.result.data);
      this.dataSourceOptimize.paginator = this.paginator;
      this.dataSourceOptimizeAll = new MatTableDataSource<any>(r.result.data);

      this.info_sync = r.result.sync[0];

      this.filter(filter_value);
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
    });
  }

  pdf(ruc_issuer: string, type_document: string, serie: string, number: string, date_issue: string) {
    if (serie[0] == 'T') return;

    date_issue = this.fn.convert_date(date_issue, 'dd/mm/yyyy');

    const data = {
      ruc: ruc_issuer,
      type_document,
      serie,
      number,
      date_issue
    };

    this.fn.show_spinner();

    this.s_guide.get_file(data, 'pdf').subscribe(r => {
      this.fn.hiden_loading();

      if (!r.success) {
        this.fn.message_error(r.message);
        return;
      }
      this.pdf_64 = r.result.file_base64;

      this.fn.print_pdfbase64(this.pdf_64);
    })
  }

  download_file(ruc_issuer: string, type_document: string, serie: string, number: string, date_issue: string, type_file: string) {
    if (serie[0] == 'T' && type_file == 'pdf') return;

    date_issue = this.fn.convert_date(date_issue, 'dd/mm/yyyy');

    const data = {
      ruc: ruc_issuer,
      type_document,
      serie,
      number,
      date_issue
    };

    this.fn.show_spinner();

    this.s_guide.get_file(data, type_file).subscribe(r => {
      this.fn.hiden_loading();

      if (!r.success) {
        this.fn.message_error(r.message);
        return;
      }

      this.pdf_64 = r.result.file_base64;

      console.log(this.pdf_64);

      const name_file = `${ruc_issuer}-${type_document}-${serie}-${number}.${type_file}`;
      this.fn.download_file64(this.pdf_64, type_file, name_file);
    })
  }

  filter(filterValue: string) {
    filterValue = filterValue.trim();

    if (window.innerWidth <= 767) {

      this.dataSourceOptimize.data = this.dataSourceOptimizeAll.data;

      this.dataSourceOptimize.data = this.dataSourceOptimize.data.filter(item => {
        for (const key in item) {
          if (item[key] && item[key].toString().includes(filterValue)) {
            return true; // Si alguna propiedad contiene el valor, se incluye en el resultado
          }
        }
        return false; // Si ninguna propiedad contiene el valor, se excluye del resultado
      });
    }
    else {
      this.dataSourceOptimize.filter = filterValue;
    }
  }


  date_format(date_db: string) {
    date_db = date_db.replace('.000Z', '');

    const date = new Date(date_db);

    return date.toLocaleString('es-PE').replace(',', '');
  }

  date_time_format(date_time: string) {
    date_time = date_time.replace('.000Z', '').replace('T', ' ');

    let a_date_time = date_time.split(' ');

    let date_return = this.fn.convert_date(a_date_time[0]);

    return date_return + ' ' + a_date_time[1];
  }



  openModalAnulado() {
    this.anulado = true;
  }

  closeModalAnulado() {
    this.anulado = false;
  }
}
