import { Injectable } from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Biến BehaviorSubject để lưu trữ giá trị ngôn ngữ và tiền tệ
  private langSubject = new BehaviorSubject<string>('vi');
  private currencySubject = new BehaviorSubject<string>('vn');


  // Observable để các component subscribe và nhận giá trị mới
  currentLang$ = this.langSubject.asObservable();
  currentCurrency$ = this.currencySubject.asObservable();


  // Hàm cập nhật giá trị ngôn ngữ
  updateLang(newLang: string) {
    this.langSubject.next(newLang);
  }

  // Hàm cập nhật giá trị tiền tệ
  updateCurrency(newCurrency: string) {
    this.currencySubject.next(newCurrency);
  }

}
