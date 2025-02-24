import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../../dto/Response/ApiResponse';
import {BannerDTO} from '../../../models/BannerDTO';
import {AddressDTO} from '../../../dto/address/AddressDTO';

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {


  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiBaseUrl}/address`;


  getAddressByUserId(userId: number | null): Observable<ApiResponse<AddressDTO[]>> {
    return this.http.get<ApiResponse<AddressDTO[]>>(`${this.apiUrl}/user/${userId}`);
  }
  setDefaultAddress(addressId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/set-default?addressId=${addressId}&userId=${userId}`, {});
  }

  addAddress(userId: number, address: AddressDTO): Observable<ApiResponse<AddressDTO>> {
    return this.http.post<ApiResponse<AddressDTO>>(`${this.apiUrl}/add?userId=${userId}`, address);
  }
  deleteAddress(userId: number, addressId: number): Observable<any> {
    return this.http.delete<ApiResponse<AddressDTO>>(`${this.apiUrl}/delete/${addressId}?userId=${userId}`
    );
  }
  updateAddress(userId: number, addressId: number, address: AddressDTO): Observable<ApiResponse<AddressDTO>> {
    return this.http.put<ApiResponse<AddressDTO>>(`${this.apiUrl}/update/${addressId}?userId=${userId}`, address);
  }



}
