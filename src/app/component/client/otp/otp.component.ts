import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ForgotPasswordService} from '../../../services/forgot-password/forgot-password.service';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {response} from 'express';
import {error} from 'console';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OTPComponent implements OnInit {
  @ViewChild('OtpForm') forgotPasswordForm!: NgForm;
  otp: string = '';
  email: string = '';
  errorMessage: string = '';

  currentLang: string = '';
  currentCurrency: string = '';


  constructor(
    private activatedRoute: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService,
    private router: Router,
    private navigationService: NavigationService,
  ) {
    // Lấy email từ query params
    this.email = this.activatedRoute.snapshot.queryParams['email'];
  }

  onSubmit(): void {
    if (!this.otp || this.otp.length < 4) {
      this.errorMessage = 'Vui lòng nhập mã OTP hợp lệ.';
      return;
    }

    // Gọi API xác thực OTP
    this.forgotPasswordService.verifyOtp(this.email, this.otp).subscribe({
      next: async () => {
        console.log('Xác thực OTP thành công');

        // Điều hướng sang trang reset-password-email/{email} theo API mới
        await this.router.navigate(
          [`/client/${this.currentCurrency}/${this.currentLang}/reset-password/${this.email}`]
        );
      },
      error: (error) => {
        console.error('Lỗi xác thực OTP:', error);
        this.errorMessage = error.error?.message || 'Mã OTP không hợp lệ. Vui lòng thử lại.';
      }
    });
  }

  ngOnInit(): void {
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.navigationService.currentCurrency$.subscribe((currency) => {
      this.currentCurrency = currency;
    });
  }
}
