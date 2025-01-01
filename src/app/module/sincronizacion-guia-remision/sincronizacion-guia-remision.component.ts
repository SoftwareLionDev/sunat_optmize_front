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

  public displayedColumnsOptimize: string[] = ['visto', 'dateTime', 'type', 'Numeration', 'Transmitter', 'BusinessName', 'status', 'descripcion'];
  public dataSourceGuia = new MatTableDataSource<any>([]);
  public totalGuias: number = 0;
  public guiasCompletadas: number = 0;
  public guiasNoCompletadas: number = 0;
  public seleccionarFecha: string = ''; 
  public guias: any[] = []; 
  public guiasFiltradas: any[] = [];
  public pdf_64: string = '';
  
  constructor(
       private s_guide: GuideService,
       private http: HttpClient,      
       private fn: Funtions,
       private sppiner:NgxSpinnerService
  ) { }

  ngAfterViewInit() {
    this.dataSourceGuia.paginator = this.paginator;
  }

  ngOnInit(): void {}

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
  

  public mostrar_mensajes: boolean = false;

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



