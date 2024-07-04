import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollaborateService {
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
    if(action?.action === "create-project") {
      return this.http.post<any>(`${this.url}/${action?.action}`, data);
    } else if(action?.action == "update-project") {
      return this.http.post<any>(`${this.url}/${action?.action}` + "/" + action?.id,  data);
    }
    return this.http.post<any>(`${this.url}/${action}`, data);

  }

  addUpdateMentorData(action?: any, data?: any): Observable<any> {
    return this.http.post<any>(
      `${this.url}/${action}` + "/" + data?.user_id,
      data
    );
  }

  updateData(action?: any, data?: any) {
    if (action == "update-club" ) {
      return this.http.post(`${this.url}/${action}/${data?.id}`, data);
    } 
    return this.http.put(`${this.url}/${action}/${data?.id}`, data);
  }

  deleteData(action?: string, id?: any): Observable<any> {
    return this.http.delete(`${this.url}/${action}/${id}`);
  }
}
