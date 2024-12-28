import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isHome: boolean = false;

  constructor(private router: Router) {
    // Kiểm tra nếu đường dẫn hiện tại là "/"
    this.router.events.subscribe(() => {
      this.isHome = this.router.url === '/client'  ;
    });
  }
}
