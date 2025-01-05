import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
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
  currentLang: string = 'vi';
  currentCurrency: string = 'vn';

  constructor(private router: Router, private navigationService: NavigationService) {
    // Lắng nghe sự kiện NavigationEnd để kiểm tra URL hiện tại
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra nếu URL hiện tại là dạng "/client/:currency/:lang"
        const segments = this.router.url.split('/');
        this.isHome = segments.length === 4 && segments[1] === 'client';
      }
      // Theo dõi ngôn ngữ hiện tại
      this.currentLang = this.navigationService.getCurrentLang();
    });


  }

  navigate(route: string) {
    this.navigationService.navigateTo(route); // Sử dụng service để chuyển hướng
  }

  changeLanguageAndCurrency(lang: string, currency: string) {
    if (this.currentLang !== lang) {
      this.currentLang = lang; // Cập nhật ngôn ngữ trong UI
      this.navigationService.updateLangAndCurrency(this.currentLang, this.currentCurrency); // Cập nhật URL
    }
    if (this.currentCurrency !== currency) {
      this.currentCurrency = currency; // Cập nhật ngôn ngữ trong UI
      this.navigationService.updateLangAndCurrency(this.currentLang, this.currentCurrency); // Cập nhật URL
    }
  }
}
