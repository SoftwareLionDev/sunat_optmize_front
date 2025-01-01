import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../config';
import { ResponseApi } from '../interfaces/response-api';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(
    private http: HttpClient,
    private s_user: UserService
  ) { }

  list(start_date: string, end_date: string, type_guide: string, summary: boolean, confirmadas: string): Observable<ResponseApi> {
    let session_ls = this.s_user.session_ls();
    const url = AppConfig.url_api + `/guide?start_date=${start_date}&end_date=${end_date}&type_guide=${type_guide}&ruc=${session_ls.ruc}&summary=${summary}&confirmadas=${confirmadas}`;
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };
    return this.http.get<ResponseApi>(url, { headers: _headers });
  }

  get_file(body: any, type_file: string): Observable<ResponseApi> {
    const url = AppConfig.url_api + '/guide/file/' + type_file;
    let session_ls = this.s_user.session_ls();
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };

    return this.http.post<ResponseApi>(url, body, { headers: _headers });
  }

  
  get_content_message(code_message: string, url: string): Observable<ResponseApi> {
    const url_api = AppConfig.url_api + '/message/content';
    const body = {
      code_message,
      url
    };

    let session_ls = this.s_user.session_ls();
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };

    return this.http.post<ResponseApi>(url_api, body, { headers: _headers });
  }


  guiasSicronizar(fecha_sync: string){
    const url_api = AppConfig.url_api + '/sunat/sync';
    const body = {
      fecha_sync
    };
    let session_ls = this.s_user.session_ls();
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };

    return this.http.post<ResponseApi>(url_api, body, { headers: _headers });
  }





  
}

