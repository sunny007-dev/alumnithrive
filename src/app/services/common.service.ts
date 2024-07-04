import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  url: any;

  constructor(public http:HttpClient) { 
    this.url = environment.apiUrl;
  }

  getAllData(data: any) {
    return this.http.get(`${this.url}/${data}`);
  }


  /**
   * Get all count from api
   * @returns 
   */
  public getAllCount(action?:string) {
    return this.http.get(`${this.url}/${action}`);
  }
}
