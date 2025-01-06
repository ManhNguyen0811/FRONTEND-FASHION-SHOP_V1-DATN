import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CheckoutService} from '../../../../services/checkout/checkout.service';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})
export class ShippingComponent {

  constructor(private router: Router, private checkoutService: CheckoutService) {}

  goToPayment() {
    this.router.navigate(['/checkout/payment']);
  }
}
