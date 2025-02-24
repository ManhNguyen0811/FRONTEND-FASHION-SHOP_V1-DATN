import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private apiUrl = 'http://localhost:8080/api/v1/orders/history'; // Thay bằng URL API của bạn

  constructor(private http: HttpClient) {}

  getOrderHistory(userId: number, page: number = 0, size: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}?page=${page}&size=${size}`);
  }
}
