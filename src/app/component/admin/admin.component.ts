import { Component } from '@angular/core';
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
  isMenuVisible: boolean = true; // Menu ban đầu hiển thị

  // Hàm để ẩn/tắt menu
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
