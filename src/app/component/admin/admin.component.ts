import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink,RouterOutlet,MenuComponent,HeaderAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
