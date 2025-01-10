import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
constructor() {
}

}
