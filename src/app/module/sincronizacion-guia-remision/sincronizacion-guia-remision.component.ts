import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { GuideService } from 'src/app/services/guide.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-sincronizacion-guia-remision',
  templateUrl: './sincronizacion-guia-remision.component.html',
  styleUrls: ['./sincronizacion-guia-remision.component.css']
})
export class SincronizacionGuiaRemisionComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumnsOptimize: string[] = ['visto', 'dateTime', 'type', 'Numeration', 'Transmitter', 'BusinessName', 'status', 'verpdf', 'descripcion'];
  public dataSourceGuia = new MatTableDataSource<any>([]);
  public totalGuias: number = 0;
  public guiasCompletadas: number = 0;
  public guiasNoCompletadas: number = 0;
  public seleccionarFecha: string = ''; 
  public hoy: Date = new Date(); 
  public guias: any[] = []; 
  public guiasFiltradas: any[] = [];
  public pdf_64: string = '';  
  public mostrar_mensajes: boolean = false;
  
  constructor(
       private s_guide: GuideService,
       private http: HttpClient,      
       private fn: Funtions,
       private sppiner:NgxSpinnerService
  ) { }

  ngAfterViewInit() {
    this.dataSourceGuia.paginator = this.paginator;
  }

  ngOnInit(): void {
    const s_fecha_actual = this.fn.convert_date(this.hoy, 'yyyy-mm-ddT00:00:00');
    this.seleccionarFecha = s_fecha_actual;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSourceGuia.filter = filterValue;
    this.guiasFiltradas = this.guias.filter((guia) => {
      return (
        (guia.fecha_emision?.toLowerCase().includes(filterValue) || '') ||
        (guia.tipo_gre?.toLowerCase().includes(filterValue) || '') ||
        (guia.g_numSerie?.toLowerCase().includes(filterValue) || '') ||
        (guia.g_numCpe?.toLowerCase().includes(filterValue) || '') ||
        (guia.g_rucEmisor?.toLowerCase().includes(filterValue) || '') ||
        (guia.razon_social?.toLowerCase().includes(filterValue) || '') ||
        (guia.estado?.toLowerCase().includes(filterValue) || '') ||
        (guia.desAsunto?.toLowerCase().includes(filterValue) || '')
      );
    });
  }

 


  public buscarGuias(): void {
    this.mostrar_mensajes = false;
    if (this.seleccionarFecha) {
      this.sppiner.show();      
      var fecha_sync = this.fn.convert_date(this.seleccionarFecha, 'yyyy-mm-dd');
      console.log(fecha_sync);
      this.s_guide.guiasSicronizar(fecha_sync).subscribe({
        next: (response) => {
          this.sppiner.hide();
          if(!response.success){
            this.fn.message_error(response.message);
          }
          this.dataSourceGuia.data = response.result;
          this.guias = response.result;
          console.log(this.dataSourceGuia);
          this.guiasFiltradas = [...this.guias];  
          // Procesar estados
          this.totalGuias = this.guias.length;
          this.guiasCompletadas = this.guias.filter((g) => g.estado === 'COMPLETADO').length;
          this.guiasNoCompletadas = this.guias.filter((g) => g.estado === 'NO COMPLETADO').length;

          this.mostrar_mensajes = true;
        },
        error: (error) => {
          this.fn.message_error(error.message.includes('Http failure response') ? 'No se pudo conectar con la fuente de datos' : error.message);
          this.sppiner.hide();
        },
      });
    } 
  }
  

  download_file(ruc_issuer: string, type_document: string, serie: string, number: string, date_issue: string, type_file: string) {
    if (serie[0] == 'T' && type_file == 'pdf') return;

    date_issue = date_issue.split(' ')[0];

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
        this.fn.message_warning(r.message);
        return;
      }

      this.pdf_64 = r.result.file_base64;

      console.log(this.pdf_64);

      const name_file = `${ruc_issuer}-${type_document}-${serie}-${number}.${type_file}`;
      this.fn.download_file64(this.pdf_64, type_file, name_file);
    })
  }
    
  
 
  pdf(ruc_issuer: string, type_document: string, serie: string, number: string, date_issue: string) {
    if (serie[0] == 'T') return;
    const fecha_emision = date_issue.split(' ')[0];
    const data = {
      ruc: ruc_issuer,
      type_document,
      serie,
      number,
      date_issue: fecha_emision
    };

    console.log(data);

    this.fn.show_spinner();

    this.s_guide.get_file(data, 'pdf').subscribe(r => {
      this.fn.hiden_loading();

      if (!r.success) {
        this.fn.message_warning(r.message);
        return;
      }
      this.pdf_64 = r.result.file_base64;

      this.fn.print_pdfbase64(this.pdf_64);
    })
  }
  
  

 public convertirFechaBaja(fecha_hora: string) {
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


 

}



