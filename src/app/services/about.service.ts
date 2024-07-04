import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
url: any;
  constructor(public http: HttpClient) {
    this.url = environment?.apiUrl;
  }

  getAllData(action?: string, data?: any): Observable<any> {
    return this.http
      .get(`${this.url}/${action}`);
  }
  
  getDataById(action?: string, id?: any) {
    return this.http.get(`${this.url}/${action}/${id}`);
  }

  postData(action?: any, data?:any): Observable<any> {
    if(action?.action === "create-team") {
      return this.http.post<any>(`${this.url}/${action?.action}`, data);
    } else if(action?.action == "update-team") {
      return this.http.post<any>(`${this.url}/${action?.action}` + "/" + action?.id,  data);
    }
     else {
      return this.http.post<any>(`${this.url}/${action}`, data);
    }
  }
}
