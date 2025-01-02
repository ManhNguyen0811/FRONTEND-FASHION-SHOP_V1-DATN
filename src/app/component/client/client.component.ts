import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { NavBottomComponent } from "./nav-bottom/nav-bottom.component";
import { HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterLink, RouterOutlet, HeaderComponent, NavBottomComponent,HttpClientModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
