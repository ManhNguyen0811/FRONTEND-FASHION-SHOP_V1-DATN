import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private currentLang: string = 'vi'; // Ngôn ngữ mặc định
  private currentCurrency: string = 'vn'; //Đơn vị tiền tệ
  private exchangeRates:{ [key: string]: number } = {
    us: 0.000043, // Tỷ giá VNĐ sang USD
    jp: 0.0065,  // Tỷ giá VNĐ sang JPY
    vn: 1,
  };


  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Theo dõi thay đổi URL để cập nhật ngôn ngữ và tiền tệ
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const segments = this.router.url.split('/');
        if (segments.length >= 4 && segments[1] === 'client') {
          this.currentCurrency = segments[2] || 'vn'; // Lấy currency từ URL
          this.currentLang = segments[3] || 'vi'; // Lấy lang từ URL
        }
      });
  }

  navigateTo(route: string) {
    // Chuyển hướng kèm theo ngôn ngữ và đơn vị tiền tệ hiện tại
    this.router.navigate([`/client/${this.currentCurrency}/${this.currentLang}/${route}`]);
  }

  // Lấy ngôn ngữ hiện tại
  getCurrentLang(): string {
    return this.currentLang;
  }
  // Lấy đơn vị tiền tệ hiện tại
  getCurrentCurrency(): string {
    return this.currentCurrency;
  }

  //hàm chuyển đổi tiền tệ
  convertCurrency(amount: number): string {
    const exchangeRate = this.exchangeRates[this.currentCurrency] || 1;

    switch (this.currentCurrency) {
      case 'us':
        return `${(amount * exchangeRate).toFixed(2)} USD`;
      case 'jp':
        return `${(amount * exchangeRate).toFixed(2)} ¥`;
      case 'vn':
      default:
        return `${amount.toLocaleString('vi-VN')} VND`;
    }
  }

  updateLangAndCurrency(newLang: string, newCurrency: string) {
    // Cập nhật giá trị trong service
    this.currentLang = newLang;
    this.currentCurrency = newCurrency;

    // Lấy URL hiện tại
    const currentUrl = this.router.url;

    // Tách đường dẫn thành các phần
    const segments = currentUrl.split('/');

    // Thay đổi giá trị `currency` và `lang` (giả sử vị trí currency là [2], lang là [3])
    if (segments.length >= 4) {
      segments[2] = newCurrency; // Cập nhật currency
      segments[3] = newLang;     // Cập nhật language
    }

    // Điều hướng đến URL mới
    const updatedUrl = segments.join('/');
    this.router.navigateByUrl(updatedUrl);
  }
}
