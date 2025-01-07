import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';

@Component({
  selector: 'app-coupon',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.scss'
})
export class CouponComponent {
  couponCode: string = '';
  selectedCoupon: string | null = null;
  // constructor(private couponService: CouponService) {}
  // applyCoupon() {
  //   if (this.couponCode) {
  //     this.couponService.validateCoupon(this.couponCode).subscribe(
  //       (response) => {
  //         alert(`Mã giảm giá hợp lệ: ${this.couponCode}`);
  //         this.couponCode = '';
  //       },
  //       (error) => {
  //         alert('Mã giảm giá không hợp lệ');
  //       }
  //     );
  //   }

  constructor(private router: Router, private navigationService: NavigationService) {
  }

  navigateTo(route:string){
    this.navigationService.navigateTo(route);
  }


  selectCoupon(couponName: string) {
    this.selectedCoupon = couponName;
    alert(`Bạn đã chọn phiếu giảm giá: ${couponName}`);
  }

  applySelectedCoupon() {
    if (this.selectedCoupon) {
      alert(`Áp dụng phiếu giảm giá: ${this.selectedCoupon}`);
      this.selectedCoupon = null;
    }
  }

  cancel() {
    this.couponCode = '';
    this.selectedCoupon = null;
    alert('Hủy áp dụng mã giảm giá');
  }
}
