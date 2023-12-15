import { Injectable } from '@angular/core';
import { AppConfig } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  login(body: any): Observable<ResponseApi> {
    const url = AppConfig.url_api + '/user/login';

    return this.http.post<ResponseApi>(url, body);
  }

  session_ls() {
    const ls_session = localStorage.getItem('session');

    return ls_session ? JSON.parse(ls_session) : null;
  }
}
