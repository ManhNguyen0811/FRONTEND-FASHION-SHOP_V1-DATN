import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { NavigationService} from '../../../services/Navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink,TranslateModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  constructor(private router: Router, private navigationService: NavigationService) {
  }

}
