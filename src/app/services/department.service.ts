import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseApi } from '../interfaces/response-api';
import { AppConfig } from '../config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient
  ) { }

  list(): Observable<ResponseApi> {
    const url = AppConfig.url_api + `/department`;
    return this.http.get<ResponseApi>(url);
  }
}
