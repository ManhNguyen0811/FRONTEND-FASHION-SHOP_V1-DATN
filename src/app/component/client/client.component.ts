import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavBottomComponent } from "./nav-bottom/nav-bottom.component";
import {FooterComponent} from './footer/footer.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponComponent} from './coupon/coupon.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent, NavBottomComponent, FooterComponent,

  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
