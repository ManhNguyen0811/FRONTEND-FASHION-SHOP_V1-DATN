import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {CheckoutService} from '../../../../services/checkout/checkout.service';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-shipping',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})
export class ShippingComponent {

  selectedMethod: string = '';


  constructor(private router: Router, private checkoutService: CheckoutService) {}

  goToPayment() {
    this.router.navigate(['/checkout/payment']);
  }

  onSelectionChange(value: string) {
    this.selectedMethod = value;
  }


}
