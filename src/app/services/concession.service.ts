import { Injectable } from '@angular/core';
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';
import { AppConfig } from '../config';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ConcessionService {

  session_ls = this.s_user.session_ls();
  _headers = {
    'Authorization': 'Bearer ' + this.session_ls.token
  };

  constructor(
    private http: HttpClient,
    private s_user: UserService
  ) { }

  save(body: any, update: boolean): Observable<ResponseApi> {
    let url = AppConfig.url_api + '/concession';

    if (update) {
      return this.http.put<ResponseApi>(url, body, { headers: this._headers });
    }
    else {
      return this.http.post<ResponseApi>(url, body, { headers: this._headers });
    }
  }

  list(): Observable<ResponseApi> {
    const url = AppConfig.url_api + `/concession`;
    return this.http.get<ResponseApi>(url, { headers: this._headers });
  }

  list_log(id_concession: number): Observable<ResponseApi> {
    const url = AppConfig.url_api + `/concession/log/${id_concession}`;

    return this.http.get<ResponseApi>(url, { headers: this._headers });
  }

  change_state(id_concession: number, id_state: string): Observable<ResponseApi>{
    const url = AppConfig.url_api + `/concession/change-state`;
    const body = {
      id_concession,
      id_state
    };
    
    return this.http.post<ResponseApi>(url, body, { headers: this._headers });
  }

  delete(id_concession: number){
    const url = AppConfig.url_api + `/concession/`+id_concession;
    
    return this.http.delete<ResponseApi>(url, { headers: this._headers });
  }
}
