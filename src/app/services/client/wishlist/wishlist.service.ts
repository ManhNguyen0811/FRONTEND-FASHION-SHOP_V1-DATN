import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {color} from 'chart.js/helpers';
import {ApiResponse} from '../../../dto/Response/ApiResponse';
import {WishlistDTO} from '../../../dto/wishlistDTO';
import {WishlistTotalResponse} from '../../../dto/WishlistTotalResponse';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl: string = `${environment.apiBaseUrl}/wishlist`;
  constructor(private http: HttpClient) { }

  //Thêm sản phẩm vào wishlist ở trang Product
  toggleWishlistInProduct(userId: number, variantId: number): Observable<ApiResponse<WishlistDTO>> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('variantId', variantId.toString());

    return this.http.post<ApiResponse<WishlistDTO>>(`${this.apiUrl}/toggle`, {}, { params });
  }

  //Thêm sản phẩm vào wishlist ở trang ProductDetail
  toggleWishlistInProductDetail(userId: number, productId: number, colorId: number): Observable<ApiResponse<WishlistDTO>> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('productId', productId.toString())
      .set('colorId', colorId.toString());

    return this.http.post<ApiResponse<WishlistDTO>>(`${this.apiUrl}/toggle-by-product-color`, null, { params });
  }

  //Lấy danh sách sản phẩm trong wishlist
  getUserWishlist(userId: number, language: string ): Observable<ApiResponse<WishlistDTO[]>> {
    return this.http.get<ApiResponse<WishlistDTO[]>>(`${this.apiUrl}/${userId}`);
  }

  //Lấy tổng số sản phẩm trong wishlist
  getWishlistTotal(userId: number, language: string ): Observable<ApiResponse<WishlistTotalResponse>> {
    return this.http.get<ApiResponse<WishlistTotalResponse>>(`${this.apiUrl}/total/${userId}`);
  }
}
