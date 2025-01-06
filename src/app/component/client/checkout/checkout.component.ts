import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {ReviewOrderComponent} from './review-order/review-order.component';
import {PaymentComponent} from './payment/payment.component';
import {ShippingComponent} from './shipping/shipping.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    RouterOutlet, ShippingComponent, PaymentComponent, ReviewOrderComponent, NgIf, RouterLink
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  currentStep: string = 'shipping'; // Mặc định là 'shipping'

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Theo dõi sự thay đổi URL để cập nhật currentStep
    this.route.url.subscribe((urlSegments) => {
      const lastSegment = urlSegments[urlSegments.length - 1]?.path;
      this.currentStep = lastSegment || 'shipping';
    });
  }
}
