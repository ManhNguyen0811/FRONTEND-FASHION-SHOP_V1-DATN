import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink,RouterOutlet,MenuComponent,HeaderAdminComponent,NgClass],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
 
  isMenuActive: boolean = false; // Biến để theo dõi trạng thái

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive; // Đảo trạng thái khi nhấn nút
  }
}
