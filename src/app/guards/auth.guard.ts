import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn
} from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NavigationService} from '../services/Navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  currentLang: string = ''; // Ngôn ngữ mặc định
  currentCurrency: string = ''; // Tiền tệ mặc định
  constructor(
    private tokenService: TokenService,
    private navigationService: NavigationService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.navigationService.currentCurrency$.subscribe((currency) => {
      this.currentCurrency = currency;
    });
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;

    if (isPlatformBrowser(this.platformId)) {
      if (!isTokenExpired && isUserIdValid) {
        return true;
      } else {
        const confirmRedirect = window.confirm(
          'Bạn cần đăng nhập để truy cập. Bạn có muốn chuyển đến trang đăng nhập không?'
        );
        if (confirmRedirect) {
          this.router.navigate([`/client/${this.currentCurrency}/${this.currentLang}/login`]);
        }
        return false;
      }
    }
    return false;
  }
}

// Sử dụng functional guard như sau:
export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {

  return inject(AuthGuard).canActivate(next, state);
}
