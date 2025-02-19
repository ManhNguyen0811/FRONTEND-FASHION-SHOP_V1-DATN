import { Component,OnInit  } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CommonModule, NgClass} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [
    NgClass,CommonModule,
    RouterLink
  ],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  paymentData: any = {};
  isSuccess: boolean = false;
  currentLang: string = ''; // Ngôn ngữ mặc định
  currentCurrency: string ='' ; // Tiền tệ mặc định
  constructor(private route: ActivatedRoute, private router: Router, private navigationService: NavigationService, private http: HttpClient, ) {}

  async ngOnInit(): Promise<void> {

    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await  firstValueFrom(this.navigationService.currentCurrency$);

    this.route.queryParams.subscribe(params => {
      this.paymentData = { ...params };
      this.isSuccess = this.paymentData.vnp_ResponseCode === '00'; // Kiểm tra mã phản hồi từ VNPay
      if (this.isSuccess) {
        this.clearCart(); // Xóa giỏ hàng nếu thanh toán thành công
      }

    });
  }

  formatCurrency(amount: string): string {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount) / 100);
  }

  getStatusText(status: string): string {
    return status === '00' ? 'Giao dịch thành công' : 'Giao dịch thất bại';
  }

  clearCart() {
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId');

    // Kiểm tra nếu cả hai đều null
    if (!userId && !sessionId) {
      console.error("❌ Không có userId hoặc sessionId, không thể xóa giỏ hàng.");
      return;
    }

    const params: any = {};
    if (userId) params.userId = userId;
    if (sessionId) params.sessionId = sessionId;

    this.http.delete(`http://localhost:8080/api/v1/cart/clear`, { params }).subscribe({
      next: () => console.log('🛒 Giỏ hàng đã được xóa thành công!'),
      error: (err) => console.error('❌ Lỗi khi xóa giỏ hàng:', err)
    });
  }

}
