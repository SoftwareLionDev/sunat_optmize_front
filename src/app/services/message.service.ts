import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { AppConfig } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
    private s_user: UserService
  ) { }

  get_content(code_message: string, url_content: string): Observable<ResponseApi>{
    let session_ls = this.s_user.session_ls();
    const url = AppConfig.url_api+'/message/content';

    const _headers = {
      'Authorization': 'Bearer '+session_ls.token
    };

    const body = {
      code_message,
      url: url_content
    };

    return this.http.post<ResponseApi>(url, body, { headers: _headers });
  }
}
