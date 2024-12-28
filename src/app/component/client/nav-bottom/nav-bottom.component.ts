import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bottom',
  standalone: true,
  imports: [NgClass,
    CommonModule,
    HeaderComponent,
    RouterLink ],
  templateUrl: './nav-bottom.component.html',
  styleUrl: './nav-bottom.component.scss'
})
export class NavBottomComponent {
  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
  }

  categories = [
    { name: 'ĐỒ MẶC NGOÀI', img: 'assets/images/thoitrangnu.jpg' },
    { name: 'QUẦN', img: 'assets/images/thoitrangnu.jpg' },
    { name: 'ĐỒ MẶC NHÀ', img: 'assets/images/thoitrangnu.jpg' },
    { name: 'PHỤ KIỆN', img: 'assets/images/hinhDoc1.webp' },
    { name: 'HEATTECH', img: 'assets/heattech.png' },
    { name: 'UT: Áo Thun', img: 'assets/ut.png' },
    { name: 'AIRism', img: 'assets/airism.png' },
    { name: 'HÀNG MỚI VỀ', img: 'assets/new.png' },
    { name: 'KHUYẾN MÃI', img: 'assets/limited.png' },
    { name: 'SẮP MỞ BÁN', img: 'assets/comingsoon.png' }
  ];
}
