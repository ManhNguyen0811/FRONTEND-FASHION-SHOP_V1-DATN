import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule,
    RouterLink, RouterOutlet, TranslatePipe,
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent {
  constructor(private router: Router, private navigationService: NavigationService) {
  }

  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }

  getConvertedCurrency(amount: number): string {
    console.log(this.navigationService.getCurrentCurrency())
    return this.navigationService.convertCurrency(amount);
  }

  // Quản lý trạng thái mở/đóng cho từng accordion item
  isDetailsOpen: boolean = false; // Mặc định mở
  isCareOpen: boolean = false; // Mặc định đóng

  // Hàm để toggle trạng thái mở/đóng
  toggleAccordion(section: string): void {
    if (section === 'details') {
      this.isDetailsOpen = !this.isDetailsOpen; // Đảo trạng thái của "Chi tiết"
    } else if (section === 'care') {
      this.isCareOpen = !this.isCareOpen; // Đảo trạng thái của "Chất liệu / Cách chăm sóc"
    }
  }

//Reviews
  rating: number = 5;// Trung bình số sao
  reviewCount: number = 999;//Tổng số đánh giá

  // Danh sách đánh giá
  reviews = [
    {
      title: 'Comfortable',
      rating: 5,
      size: 'S',
      fit: 'Đúng với kích thước',
      comment:
        "Uniqlo’s AIRism UV Protection Mesh Full-Zip Hoodie offers excellent sun protection with a lightweight, breathable fabric that’s perfect for daily wear. Its stylish design blends seamlessly into any outfit, making it both functional and fashionable. Easy to maintain and comfortable for all day use, it’s a great addition for those mindful of sun safety.",
      user: 'MLJane',
      gender: 'Nữ',
      age: '25 đến 34 tuổi',
      height: '156 - 160cm',
      weight: '51 - 55kg',
      shoeSize: 'EU38',
      location: 'Selangor',
      date: '22/12/2024',
    },
    {
      title: 'Like it',
      rating: 3,
      size: 'XL',
      fit: 'Đúng với kích thước',
      comment: 'I like it. Very comfortable to wear and nice colour too',
      user: 'Chew',
      gender: 'Nữ',
      age: '55 đến 64 tuổi',
      height: '166 - 170cm',
      weight: '66 - 70kg',
      shoeSize: 'EU39',
      location: 'Singapore',
      date: '22/12/2024',
    },
  ];

  // Tạo danh sách sao đầy đủ
  getFullStars(rating: number): Array<number> {
    return Array(Math.floor(rating)).fill(0);
  }

  // Tạo danh sách sao rỗng
  getEmptyStars(rating: number): Array<number> {
    return Array(5 - Math.floor(rating)).fill(0);
  }

}
