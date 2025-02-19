import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { PageResponse } from '../../../dto/Response/page-response';
import { CategoryAdmin } from '../../../models/Category/CategotyAdmin';
 
 

@Injectable({
  providedIn: 'root'
})
export class CategoryAdminService {

  constructor(private http : HttpClient) { }
  private apiUrl = `${environment.apiBaseUrl}/categories`

  getCategoriesAdmin(page : number, size: number,sortBy : string, sortDir: string ): Observable<ApiResponse<PageResponse<CategoryAdmin[]>>>{
    return this.http.get<ApiResponse<PageResponse<CategoryAdmin[]>>>(`${this.apiUrl}/en/admin?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)
  }
  createCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
  
  

}
