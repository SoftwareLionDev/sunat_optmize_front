import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../config';
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(
    private http: HttpClient
  ) { }

  list(start_date: string, end_date: string, type_guide: string): Observable<ResponseApi>{
    const url = AppConfig.url_api+`/guide?start_date=${start_date}&end_date=${end_date}&type_guide=${type_guide}&ruc=20536126440`;

    return this.http.get<ResponseApi>(url);
  }

  get_file(body: any, type_file: string): Observable<ResponseApi>{
    const url = AppConfig.url_api+'/guide/file/'+type_file;

    return this.http.post<ResponseApi>(url, body);
  }
}