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
    { name: 'ĐỒ MẶC NGOÀI', img: 'https://im.uniqlo.com/global-cms/spa/resf71a16ca69716ea0d7806171a1551d22fr.png',
      children: [
        { name: 'Áo Blouson & Áo Parka', img: 'https://im.uniqlo.com/global-cms/spa/res1017a8095aa156c19814acc6c133c1a3fr.jpg' },
        { name: 'Áo Down', img: 'https://im.uniqlo.com/global-cms/spa/res86899907a6bd709e533c98886cfa79d0fr.png' },
        { name: 'Áo Khoác & Áo Blazer', img: 'https://im.uniqlo.com/global-cms/spa/res54683d0d8105329d34b0faa277fc1651fr.jpg' },
        { name: 'Tất Cả ĐỒ MẶC NGOÀI', img: 'https://im.uniqlo.com/global-cms/spa/res1fb3deb971f48bb35df1afdcec064c6cfr.jpg' }
      ]
    },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'HEATTECH', img: 'assets/heattech.png' },
    { name: 'UT: Áo Thun', img: 'assets/ut.png' },
    { name: 'AIRism', img: 'assets/airism.png' },
    { name: 'HÀNG MỚI VỀ', img: 'assets/new.png' },
    { name: 'KHUYẾN MÃI', img: 'assets/limited.png' },
    { name: 'SẮP MỞ BÁN', img: 'assets/comingsoon.png' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
    { name: 'QUẦN', img: 'https://im.uniqlo.com/global-cms/spa/resd5da71558f0752d65dd506a2e5f11e38fr.png' },
    { name: 'ĐỒ MẶC NHÀ', img: 'https://im.uniqlo.com/global-cms/spa/resb64771b00f5cd167bfb4016c05133d1afr.png' },
    { name: 'PHỤ KIỆN', img: 'https://im.uniqlo.com/global-cms/spa/resf8cea0298a7dc731c3904021ee06995ffr.jpg' },
  ];

  currentLevel: number = 2;
  selectedCategory: any = null;

// Hàm xử lý khi chọn danh mục ở tầng 2
  selectCategory(category: any): void {
    if (category.children) {
      this.selectedCategory = category;
      this.currentLevel = 3; // Chuyển sang tầng 3
    }
  }

// Hàm quay lại tầng 2
  goBack(): void {
    this.currentLevel = 2; // Quay lại tầng 2
  }

}
