import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../../../models/Provinces';

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {

  constructor(private http : HttpClient) { }


  getApiProvincesFromNominatim() : Observable<Province[]>{
    return this.http.get<Province[]>(`https://provinces.open-api.vn/api/?depth=1`)
  }
  
}
