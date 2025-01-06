import { Injectable } from '@angular/core';
import {CheckoutData} from '../../models/checkout/checkoutData';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }

  private dataSubject = new BehaviorSubject<CheckoutData>({
    shippingData: { address: '', city: '', phone: '' },
    paymentMethod: '',
    orderDetails: [],
  });

  data$ = this.dataSubject.asObservable();

  // Lấy dữ liệu hiện tại
  getData(): CheckoutData {
    return this.dataSubject.getValue();
  }

  // Cập nhật dữ liệu
  updateData(updatedData: Partial<CheckoutData>) {
    const currentData = this.getData();
    const newData = { ...currentData, ...updatedData };
    this.dataSubject.next(newData);
  }
}
