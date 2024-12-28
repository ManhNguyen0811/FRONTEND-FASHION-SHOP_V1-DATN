import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavBottomComponent } from "./nav-bottom/nav-bottom.component";
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent, NavBottomComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
