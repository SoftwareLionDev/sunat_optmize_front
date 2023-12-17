import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { AppConfig } from '../config';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class ListUsersService {

  constructor(
    private http: HttpClient,
    private s_user: UserService
  ) { }

  list_users(): Observable<ResponseApi> {
    let session_ls = this.s_user.session_ls();
    const url = AppConfig.url_api + `/user`;
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };
    return this.http.get<ResponseApi>(url, { headers: _headers });
  }

  list_role(): Observable<ResponseApi> {
    let session_ls = this.s_user.session_ls();
    const url = AppConfig.url_api + `/role`;
    const _headers = {
      'Authorization': 'Bearer ' + session_ls.token
    };
    return this.http.get<ResponseApi>(url, { headers: _headers });
  }

}
