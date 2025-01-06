import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {ShippingComponent} from '../shipping/shipping.component';
import {PaymentComponent} from '../payment/payment.component';

@Component({
  selector: 'app-review-order',
  standalone: true,
  imports: [NgIf, ShippingComponent, PaymentComponent],
  templateUrl: './review-order.component.html',
  styleUrl: './review-order.component.scss'
})
export class ReviewOrderComponent {


  constructor(private router: Router) {}

  confirmOrder(): void {
    alert('Đơn hàng của bạn đã được xác nhận!');
    this.router.navigate(['/checkout/confirmation']);
  }
}
