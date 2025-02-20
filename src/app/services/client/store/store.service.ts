import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../../dto/Response/ApiResponse';
import {WishlistDTO} from '../../../dto/wishlistDTO';
import {ListStoreDTO} from '../../../dto/ListStoreDTO';
import {PageResponse} from '../../../dto/Response/page-response';
import {StoreInventoryDTO} from '../../../dto/StoreInventoryDTO';
import {StoreDetailDTO} from '../../../dto/StoreDetailDTO';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private apiUrl: string = `${environment.apiBaseUrl}/store`;

  constructor(private http: HttpClient) { }

  getStores(pageNo: number,
            pageSize: number,
            city: string,
            userLat: number,
            userLon: number): Observable<ApiResponse<PageResponse<ListStoreDTO>>> {
    let params = `?page=${pageNo}&size=${pageSize}`;

    if (city) {
      params += `&city=${encodeURIComponent(city)}`;
    }

    if (userLat && userLon) {
      params += `&userLat=${userLat}&userLon=${userLon}`;
    }

    return this.http.get<ApiResponse<PageResponse<ListStoreDTO>>>(`${this.apiUrl}/search${params}`);
  }

  getStoreInventory(productId: number, colorId: number, sizeId: number, storeId: number): Observable<ApiResponse<StoreInventoryDTO>> {
    const params = new HttpParams()
      .set('productId', productId)
      .set('colorId', colorId)
      .set('sizeId', sizeId)
      .set('storeId', storeId);

    return this.http.get<ApiResponse<StoreInventoryDTO>>(`${this.apiUrl}/inventory`, { params });
  }

  getStoreDetail(storeId: number): Observable<ApiResponse<StoreDetailDTO>> {
    return this.http.get<ApiResponse<StoreDetailDTO>>(`${this.apiUrl}/${storeId}`);
  }

}
