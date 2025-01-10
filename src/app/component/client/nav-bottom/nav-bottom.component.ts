import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {Router, RouterLink} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-nav-bottom',
  standalone: true,
  imports: [NgClass,
    CommonModule,
    HeaderComponent,
    RouterLink, TranslatePipe],
  templateUrl: './nav-bottom.component.html',
  styleUrl: './nav-bottom.component.scss'
})
export class NavBottomComponent {
  currentLang: string = 'vi'; // Ngôn ngữ mặc định
  currentCurrency: string = 'vn'; // Tiền tệ mặc định

  constructor(private navigationService: NavigationService) {
    // Lắng nghe giá trị ngôn ngữ và tiền tệ từ NavigationService
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.navigationService.currentCurrency$.subscribe((currency) => {
      this.currentCurrency = currency;
    });

    // Subscribe để nhận giá trị từ service
    this.navigationService.isSearchActive$.subscribe((value) => {
      this.isSearchActive = value;
    });
  }


  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.navigationService.toggleSearchActive();
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
