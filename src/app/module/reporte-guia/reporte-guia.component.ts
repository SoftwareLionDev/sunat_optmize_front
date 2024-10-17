import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-reporte-guia',
  templateUrl: './reporte-guia.component.html',
  styleUrls: ['./reporte-guia.component.scss']
})
export class ReporteGuiaComponent {


  anulado = false;
  public displayedColumnsOptimize: string[] = ['visto', 'dateTime', 'type', 'Numeration', 'Transmitter', 'BusinessName', 'status', 'user_notified', 'code_concession', 'name_concession', 'date_notified', 'usuario_confirmado', 'fecha_confirmacion', 'see', 'options'];
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
    private http: HttpClient,
    private s_mensaje: MessageService
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

  msg_content(code_message: string, url: string, guide: any) {
    this.modals.open(AlertComponent, {
      width: '560px',
      data: {
        code_message,
        url,
        guide
      }
    })
  }

  exportar_excel() {
    const data = this.dataSourceOptimize.data;
    const data_excel = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      console.log(element.date_notified);

      data_excel.push({
        confirmado: element.id_user_confirmacion ? 'SI': 'NO',
        tipo_gre: element.type_gre,
        numeracion: element.numeration,
        fecha_emision: element.datetime_issue,
        ruc_emisor: element.ruc_issuer,
        razon_social: element.business_name,
        estado: element.description_code,
        baja_descripcion: element.sub_status,
        fecha_baja: this.convertirFechaBaja(element.date_low),
        usuario_notificado: element.user_notified,
        codigo_concesion: element.code_concession,
        concesion: element.name_concession,
        fecha_notificada: element.date_notified,
        fecha_confirmada: element.fecha_confirmacion,
        usuario_confirmado: element.usuario_confirmado
      });
    }

    this.fn.exporto_to_excel(data_excel);
  }

  public v_start_date: string = ''; v_end_date: string = ''; v_type_guide: string = ''; v_summary: boolean = false; v_filter_value: string = ''; v_confirmadas: string = '';

  btn_search(start_date: string, end_date: string, type_guide: string, summary: boolean, filter_value: string, confirmadas: string) {
    this.v_start_date = start_date; this.v_end_date = end_date; this.v_type_guide = type_guide; this.v_summary = summary; this.v_filter_value = filter_value; this.v_confirmadas = confirmadas;
    // this.dataSourceOptimize = new MatTableDataSource<any>(ELEMENT_DATA);
    // this.dataSourceOptimize.paginator = this.paginator;
    // return;


    this.fn.show_spinner();

    this.s_guide.list(this.fn.date_db(start_date), this.fn.date_db(end_date), type_guide, summary, confirmadas).subscribe(r => {
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

    const data = {
      ruc: ruc_issuer,
      type_document,
      serie,
      number,
      date_issue
    };

    console.log(data);

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

  @ViewChild('modal_confirmacion') modal_confirmacion!: TemplateRef<any>;
  public codigo_mensaje_confirmar: string = '';
  public guia_confirmar: any;

  btn_confirmar(code_message: string, id_user_confirmacion: any, guia_confirmar: any){
    if(id_user_confirmacion) return;

    this.codigo_mensaje_confirmar = code_message;
    this.guia_confirmar = guia_confirmar;

    console.log(this.guia_confirmar);

    this.modals.open(this.modal_confirmacion, {
      width: '400px'
    })
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

  convertirFechaBaja(fecha_hora: string) {
    if(!fecha_hora) return "";

    let fecha = fecha_hora.split(' ')[0];
    let hora = fecha_hora.split(' ')[1];
    
    let [horas, minutos, segundos] = hora.split(':').map(Number);
    let periodo = horas >= 12 ? 'p. m.' : 'a. m.';
    
    // Convertir las horas al formato de 12 horas
    horas = horas % 12 || 12;  // Si la hora es 0, mostrar 12
    let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} ${periodo}`;
    
    return fecha +" "+ horaFormateada;
  }

  btn_aceptar_confirmar(confirmado: any){
    if(!confirmado) return;

    this.fn.show_spinner();

    this.s_mensaje.confirmar(this.codigo_mensaje_confirmar).subscribe(r => {
      this.fn.hiden_loading();
      
      if(!r.success){
        return this.fn.message_error(r.message);
      }

      this.modals.closeAll();
      this.fn.message_information('Confirmación registrada');
      
      this.btn_search(this.v_start_date, this.v_end_date, this.v_type_guide, this.v_summary, this.v_filter_value, this.v_confirmadas);
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message);
    });    
  }


  openModalAnulado() {
    this.anulado = true;
  }

  closeModalAnulado() {
    this.anulado = false;
  }
}
