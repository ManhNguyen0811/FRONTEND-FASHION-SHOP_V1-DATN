import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { PageResponse } from '../../../dto/Response/page-response';
import { CategoryAdmin } from '../../../models/Category/CategotyAdmin';
import { CategoryDTO } from '../../../dto/CategoryDTO';
 
 

@Injectable({
  providedIn: 'root'
})
export class CategoryAdminService {

  constructor(private http : HttpClient) { }
  private apiUrl = `${environment.apiBaseUrl}/categories`

  getCategoriesAdmin(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    name: string,
    isActive: any,
    parentId: any
  ): Observable<ApiResponse<PageResponse<CategoryAdmin[]>>> {
    let params = `?page=${page}&size=${size}`;

    if (parentId) {
      params += `&parentId=${encodeURIComponent(parentId)}`;
    }
    if (name) {
      params += `&name=${encodeURIComponent(name)}`;
    }
    if (isActive !== null && isActive !== undefined && isActive !== 'null') {
      params += `&isActive=${isActive}`;
    }
    if (sortBy) {
      params += `&sortBy=${encodeURIComponent(sortBy)}`;
    }
    if (sortDir) {
      params += `&sortDir=${encodeURIComponent(sortDir)}`;
    }
  
    return this.http.get<ApiResponse<PageResponse<CategoryAdmin[]>>>(`${this.apiUrl}/en/admin${params}`);
  }
  
  createCategory(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getParentCategories(): Observable<ApiResponse<CategoryDTO[]>>{
    return this.http.get<ApiResponse<CategoryDTO[]>>(`${this.apiUrl}/en/parent`)
  }
  getSubCategoriesByParentId(parentId: number): Observable<ApiResponse<CategoryDTO[]>>{
    return this.http.get<ApiResponse<CategoryDTO[]>>(`${this.apiUrl}/en/category/parent/${parentId}`)
  }
  

  deleteCategory(categoryId: number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${categoryId}`)
  }
  
  

}
