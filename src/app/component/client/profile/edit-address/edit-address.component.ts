import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NavigationService} from '../../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-edit-address',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.scss'
})
export class EditAddressComponent {
constructor(private navigationService: NavigationService) {
}

}
