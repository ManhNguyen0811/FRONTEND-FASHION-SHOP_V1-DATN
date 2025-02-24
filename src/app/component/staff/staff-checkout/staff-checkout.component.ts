import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {StoreHeaderComponent} from '../store-header/store-header.component';

@Component({
  selector: 'app-staff-checkout',
  standalone: true,
  imports: [
    TranslatePipe,
    StoreHeaderComponent
  ],
  templateUrl: './staff-checkout.component.html',
  styleUrl: './staff-checkout.component.scss'
})
export class StaffCheckoutComponent {

}
