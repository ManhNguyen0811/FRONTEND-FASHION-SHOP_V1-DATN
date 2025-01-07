import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavigationService} from '../../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
constructor(private navigationService: NavigationService) {
}

navigateTo(route: string) {
  this.navigationService.navigateTo(route);
}
}
