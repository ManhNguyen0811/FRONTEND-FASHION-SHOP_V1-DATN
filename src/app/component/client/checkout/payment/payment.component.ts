import { Component } from '@angular/core';
import {CheckoutService} from '../../../../services/checkout/checkout.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {ShippingComponent} from '../shipping/shipping.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    NgIf,
    ShippingComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  selectedMethod: string = '';

  constructor(private router: Router, private checkoutService: CheckoutService) {}

  // Hàm xử lý sự kiện khi chọn radio
  onSelectionChange(value: string) {
    this.selectedMethod = value;
  }



  goToReview(): void {
    this.router.navigate(['/checkout/review']);
  }



}
