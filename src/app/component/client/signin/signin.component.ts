import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
constructor(private navigationService: NavigationService) {
}

}
