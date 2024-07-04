import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectService {
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
    console.log(action, data);
    if(action?.action === "create-team" || action?.action == 'create-club' || action?.action == 'create-event') {
      return this.http.post<any>(`${this.url}/${action?.action}`, data);
    } else if(action?.action == "update-team" || action?.action == "update-club" || action?.action == "update-event") {
      return this.http.post<any>(`${this.url}/${action?.action}` + "/" + action?.id,  data);
    } else if(
      action === "update-featured" ||
      action === "update-gallery" ||
      action === "update-magazine" ||
      action === "update-news" ||
      action === "update-mentorship" ||
      action == "update-event" ||
      action == "update-club" || action == "update-journey" 
    ) {
      return this.http.post(`${this.url}/${action}/${data?.id}`, data);
    } else if(action == "update-eventType") {
      return this.http.put(`${this.url}/${action}/${data?.id}`, data);
    }
    return this.http.post<any>(`${this.url}/${action}`, data);

  }
  // public postData(action?: any, data?: any): Observable<any> {
  //   if (
  //     action?.action === "update-getFeatured" ||
  //     action?.action === "update-news" ||
  //     action?.action === "update-club" ||
  //     action?.action === "update-team" ||
  //     action?.action === "update-gallery" ||
  //     action?.action === "update-event" ||
  //     action?.action == "update-setting" ||
  //     action?.action === "updateStatus" ||
  //     action?.action == "update-journey"
  //   ) {
  //     return this.http.post<any>(
  //       `${this.url}/${action?.action}` + "/" + action?.id,
  //       data
  //     );
  //   } else if (
  //     action == "update-mentorship" ||
  //     action == "update-mentee" ||
  //     action == "filterMentor" ||
  //     action == "add-menteeMentor"
  //   ) {
  //     return this.http.post<any>(
  //       `${this.url}/${action}` + "/" + data?.user_id,
  //       data
  //     );
  //   } else if (
  //     action?.action === "create-magazine" ||
  //     action?.action === "create-news" ||
  //     action?.action === "create-club" ||
  //     action?.action === "create-getFeatured" ||
  //     action?.action === "create-team" ||
  //     action?.action === "create-gallery" ||
  //     action?.action === "create-event"
  //   ) {
  //     return this.http.post<any>(`${this.url}/${action?.action}`, data);
  //   } else if (action?.action == "senduser-mail") {
  //     return this.http.post<any>(
  //       `${this.url}/${action?.action}` + "/" + action?.id,
  //       action
  //     );
  //   }
  //   return this.http.post<any>(`${this.url}/${action}`, data);
  // }

  updateData(action?: any, data?: any) {
    if (action == "update-club" || action=="update-event" ) {
      return this.http.post(`${this.url}/${action}/${data?.id}`, data);
    } 
    return this.http.put(`${this.url}/${action}/${data?.id}`, data);
  }

  deleteData(action?: string, id?: any): Observable<any> {
    return this.http.delete(`${this.url}/${action}/${id}`);
  }
}
