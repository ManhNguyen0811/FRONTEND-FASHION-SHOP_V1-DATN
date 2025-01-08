import { NgClass, NgForOf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [NgForOf,
    NgClass,TranslateModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  constructor(private navigationService: NavigationService) {
  }

  navigateTo(route: string){
    this.navigationService.navigateTo(route);
  }




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

  //Đánh giá của khách hàng
  ratings = [
    { stars: 5, count: 1067, percentage: 92.78 },
    { stars: 4, count: 67, percentage: 5.83 },
    { stars: 3, count: 8, percentage: 0.69 },
    { stars: 2, count: 2, percentage: 0.17 },
    { stars: 1, count: 6, percentage: 0.52 },
  ];

  totalReviews = this.ratings.reduce((sum, rating) => sum + rating.count, 0);

  ngOnInit() {
    this.updatePercentages();
  }

  private updatePercentages() {
    this.ratings.forEach((rating) => {
      rating.percentage = (rating.count / this.totalReviews) * 100;
    });
  }

  //sticky-buttons
  isStickyVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const stickyButtons = document.querySelector('.sticky-buttons');
    if (stickyButtons) {
      const rect = stickyButtons.getBoundingClientRect();
      this.isStickyVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
    }
  }

  //Load reviews

  displayedReviews = 5;

  loadMoreReviews() {
    this.displayedReviews += 5;
  }

  get visibleReviews() {
    return this.reviews.slice(0, this.displayedReviews);
  }
}
