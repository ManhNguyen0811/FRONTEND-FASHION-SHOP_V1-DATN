import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { ReviewTotalDTO } from '../../../dto/ReviewTotalDTO';
import { ReviewAverageDTO } from '../../../dto/ReviewAverageDTO';

@Injectable({
  providedIn: 'root'
})
export class ReviewServiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = `${environment.apiBaseUrl}/reviews`


  getReviewTotal(productId: number): Observable<ApiResponse<ReviewTotalDTO>>{
    return this.http.get<ApiResponse<ReviewTotalDTO>>(`${this.apiUrl}/total/${productId}`)
  }
  getReviewAverage(productId : number) : Observable<ApiResponse<ReviewAverageDTO>>{
    return this.http.get<ApiResponse<ReviewAverageDTO>>(`${this.apiUrl}/average/${productId}`)
  }

}
