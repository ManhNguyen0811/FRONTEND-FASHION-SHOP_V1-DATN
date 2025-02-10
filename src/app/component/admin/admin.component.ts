import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MenuComponent, HeaderAdminComponent, NgClass],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  isMenuActive: boolean = false;

   

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.updateMenuState(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateMenuState(width);
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;  
  }

  private updateMenuState(width: number) {
    if (width < 1208) {
      this.isMenuActive = true;
    }
  }
}
