import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { TotalQty } from '../../../dto/TotalQty';
import { CartDTO } from '../../../dto/CartDTO';
import { CreateCartDTO } from '../../../dto/CreateCartDTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  constructor(private http: HttpClient) { }

  getTotalQty(userId: number, sessionId: string): Observable<ApiResponse<TotalQty>> {
    let params: string[] = [];

    if (userId !== null && userId !== undefined) {
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (sessionId?.trim()) { // Kiểm tra sessionId có giá trị hợp lệ
      params.push(`sessionId=${encodeURIComponent(sessionId)}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';

    // console.log('Request URL:', `${this.apiUrl}/total${queryString}`);

    return this.http.get<ApiResponse<TotalQty>>(`${this.apiUrl}/total${queryString}`);
  }

  getAllCart(userId: number, sessionId: string): Observable<ApiResponse<CartDTO>> {
    let params: string[] = [];

    if (userId !== null && userId !== undefined && userId !== 0) {
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (sessionId?.trim()) { // Kiểm tra sessionId có giá trị hợp lệ
      params.push(`sessionId=${encodeURIComponent(sessionId)}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';


    // console.log('Request URL:', `${this.apiUrl}${queryString}`);


    return this.http.get<ApiResponse<CartDTO>>(`${this.apiUrl}${queryString}`);
  }

  createCart(userId: number, sessionId: string, variant: CreateCartDTO): Observable<any> {
    let params: string[] = [];
    let check = false

    if (userId !== null && userId !== undefined && userId !== 0) {
      check = true
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (!check) {
      if (sessionId?.trim()) {
        params.push(`sessionId=${encodeURIComponent(sessionId)}`);
      }
    }




    const queryString = params.length ? `?${params.join('&')}` : '';
    console.log('Request URL:', `${this.apiUrl}${queryString}`);

    return this.http.post<ApiResponse<CartDTO>>(`${this.apiUrl}/add${queryString}`, variant);
  }

}
