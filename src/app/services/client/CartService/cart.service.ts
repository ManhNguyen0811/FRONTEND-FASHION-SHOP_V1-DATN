import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { TotalQty } from '../../../dto/TotalQty';
import { CartDTO } from '../../../dto/CartDTO';
import { CreateCartDTO } from '../../../dto/CreateCartDTO';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}/cart`;

  constructor(private http: HttpClient) { }


    totalCartSubject = new BehaviorSubject<number>(0);
  totalCart$ = this.totalCartSubject.asObservable();

  getQtyCart(userId: number, sessionId: string): Observable<number> {
    let params: string[] = [];
    let check = false;
  
    if (userId && userId !== 0) {
      check = true;
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (!check && sessionId?.trim()) {
      params.push(`sessionId=${encodeURIComponent(sessionId)}`);
    }
  
    const queryString = params.length ? `?${params.join('&')}` : '';
  
    return this.http.get<ApiResponse<TotalQty>>(`${this.apiUrl}/total${queryString}`).pipe(
      map(response => (response.status === 200 && response.data) ? response.data.totalCart : 0),
      catchError(error => {
        console.error('Lỗi khi lấy tổng số giỏ hàng:', error);
        return of(0);
      })
    );
  }
  

  getTotalQty(userId: number, sessionId: string): Observable<ApiResponse<TotalQty>> {
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

    // console.log('Request URL:', `${this.apiUrl}/total${queryString}`);

    return this.http.get<ApiResponse<TotalQty>>(`${this.apiUrl}/total${queryString}`);
  }

  getAllCart(userId: number, sessionId: string): Observable<ApiResponse<CartDTO>> {
    let params: string[] = [];

    if (userId !== null && userId !== undefined && userId !== 0) {
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (sessionId?.trim()) {
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
  updateQtyCart(userId: number, sessionId: string, cardId: number, newQuantity: number): Observable<any> {
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

    return this.http.put<ApiResponse<CartDTO>>(`${this.apiUrl}/${cardId}${queryString}&newQuantity=${newQuantity}`, {});
  }

  deleteCart(userId: number, sessionId: string, cardId: number): Observable<any> {
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

    return this.http.delete<ApiResponse<CartDTO>>(`${this.apiUrl}/item/${cardId}${queryString}`);
  }


  clearCart(userId: number, sessionId: string): Observable<any> {
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

    return this.http.delete<ApiResponse<CartDTO>>(`${this.apiUrl}/clear${queryString}`);
  }

}
