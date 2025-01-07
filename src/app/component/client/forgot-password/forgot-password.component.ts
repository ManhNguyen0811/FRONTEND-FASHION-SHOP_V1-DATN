import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
constructor(private navigationService: NavigationService) {
}

navigateTo(route: string) {
  this.navigationService.navigateTo(route);
}
}
