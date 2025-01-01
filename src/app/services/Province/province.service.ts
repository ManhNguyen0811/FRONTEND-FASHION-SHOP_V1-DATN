import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private jsonUrl = 'assets/vietnamAddress.json';

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<any> {
    return this.http.get(this.jsonUrl); // Lấy toàn bộ danh sách province
  }
}
