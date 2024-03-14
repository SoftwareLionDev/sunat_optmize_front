import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GuideService } from 'src/app/services/guide.service';
import { MessageService } from 'src/app/services/message.service';
import { Funtions } from 'src/app/src/funtions';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  public content_message: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private s_message: MessageService,
    private fn: Funtions
  ) {

  }

  ngOnInit() {
    let guide = this.data.guide;

    if(guide.code_gre == '31' && guide.status_code == '01'){
      this.content_message = `La G.R.E del Transportista ${guide.numeration} fue extraído desde la consulta masiva de GR de SUNAT cuya fecha de emisión corresponde a ${this.date_format(guide.datetime_issue)}`;
      return;
    }
    

    this.fn.show_spinner();

    this.s_message.get_content(this.data.code_message, this.data.url).subscribe(r => {
      this.fn.hiden_loading();

      if(!r.success){
        this.fn.message_error(r.message);
        return;
      }


      let e = document.getElementById('v-content');

      if(e){
        e.innerHTML = r.result.content_message;
      }

      this.content_message = r.result.content_message;
      console.log(this.content_message);
    }, (error) => {
      this.fn.hiden_loading();
      this.fn.message_error(error.message);
    } );
  }

  date_format(date_db: string) {
    date_db = date_db.replace('.000Z', '');

    const date = new Date(date_db);

    return date.toLocaleString('es-PE').replace(',', '');
  }
}
