import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
constructor(private navigationService: NavigationService) {
}

navigateTo(route: string) {
  this.navigationService.navigateTo(route);
}
}
