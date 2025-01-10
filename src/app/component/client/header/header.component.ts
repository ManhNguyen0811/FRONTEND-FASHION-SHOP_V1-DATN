import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isHome: boolean = false;
  currentLang: string = 'vi'; // Ngôn ngữ mặc định
  currentCurrency: string = 'vn'; // Tiền tệ mặc định

  constructor(private router: Router, private navigationService: NavigationService) {
    // Lắng nghe sự kiện NavigationEnd để kiểm tra URL hiện tại
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra nếu URL hiện tại là trang Home
        const segments = this.router.url.split('/');
        this.isHome = segments.length === 4 && segments[1] === 'client';
      }
    });

    // Lắng nghe giá trị ngôn ngữ và tiền tệ từ NavigationService
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.navigationService.currentCurrency$.subscribe((currency) => {
      this.currentCurrency = currency;
    });
  }

  changeLanguageAndCurrency(lang: string, currency: string) {
    // Cập nhật giá trị ngôn ngữ và tiền tệ trong NavigationService
    this.navigationService.updateLang(lang);
    this.navigationService.updateCurrency(currency);

    // Tạo URL mới với ngôn ngữ và tiền tệ đã thay đổi
    const updatedUrl = this.router.url.replace(
      /\/client\/[^\/]+\/[^\/]+/,
      `/client/${currency}/${lang}`
    );

    // Điều hướng đến URL mới
    this.router.navigateByUrl(updatedUrl);
  }
}
