import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavBottomComponent } from "./nav-bottom/nav-bottom.component";
import {FooterComponent} from './footer/footer.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent, NavBottomComponent, FooterComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
