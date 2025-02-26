import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { NavBottomComponent } from '../nav-bottom/nav-bottom.component';
import { Router } from '@angular/router';
import { NavigationService } from '../../../services/Navigation/navigation.service';
import { BannerService } from '../../../services/client/BannerService/banner.service';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { BannerDTO } from '../../../models/BannerDTO';
import { response } from 'express';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../../../services/token/token.service';
import { CartService } from '../../../services/client/CartService/cart.service';
import { TotalQty } from '../../../dto/TotalQty';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers: [CookieService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentLang: string = ''; // Ngôn ngữ mặc định
  currentCurrency: string = ''; // Tiền tệ mặc định
  url: string = '';
  banners: Observable<BannerDTO[] | null> = of([]);
  sessionId?: string;
  userId?: number;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private navigationService: NavigationService,
    private cookieService: CookieService,
    private tokenService: TokenService,
    private cartService: CartService,

    private bannerService: BannerService,) {
    this.sessionId = this.cookieService.get('SESSION_ID') || '';


  }

  ngAfterViewInit(): void {
    this.fetchTotalQty()

    
   

    if (this.userId === 0) {
      this.sessionId = this.cookieService.get('SESSION_ID') || '';
    }
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.playVideo(), 500);

      // Đảm bảo phát video khi người dùng click vào trang
      document.addEventListener("click", this.playVideo);
    }
    this.userId = this.tokenService.getUserId() ?? 0;
    this.cartService.getQtyCart(this.userId ?? 0, this.sessionId ?? '').subscribe(total => {
      this.cartService.totalCartSubject.next(total);  // Cập nhật tổng số lượng giỏ hàng
    });

  }

  playVideo = (): void => {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      video.muted = true;
      video.play().catch(err => console.log("Autoplay blocked:", err));
    }
  };

  async ngOnInit(): Promise<void> {
    this.fetchTotalQty()
    if (this.userId === 0) {


      this.sessionId = this.cookieService.get('SESSION_ID') || '';
    }
    if (isPlatformBrowser(this.platformId)) {
      this.handleScroll(); // Gọi xử lý ban đầu khi load trang
    }

    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await firstValueFrom(this.navigationService.currentCurrency$);
    this.banners = this.getBanners(this.currentLang);

    console.log('user : ' + this.userId)
    console.log('sessionId : ' + this.sessionId)

    if (this.userId !== 0 && this.sessionId) {
    
      this.sessionId = ''; // Đặt lại sessionId sau khi merge
    }
    this.cartService.getQtyCart(this.userId ?? 0, this.sessionId ?? '').subscribe(total => {
      this.cartService.totalCartSubject.next(total);  // Cập nhật tổng số lượng giỏ hàng
    });
    console.log('user : ' + this.userId)
    console.log('sessionId : ' + this.sessionId)

  }

  // Lắng nghe sự kiện scroll trên toàn bộ cửa sổ
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.handleScroll();
    }
  }

  handleScroll(): void {
    const carouselItems = document.querySelectorAll<HTMLDivElement>(".carousel-item");
    const scrollPosition = window.scrollY;
    carouselItems.forEach((item, index) => {
      const offset = index * window.innerHeight; // Tính vị trí của từng item

      if (scrollPosition >= offset && scrollPosition < offset + window.innerHeight) {
        const img = item.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(100%)";
      } else {
        const img = item.querySelector("img") as HTMLImageElement;
        if (img) img.style.filter = "brightness(70%)";
      }
    });
  }
  fetchTotalQty(): void {
    (this.userId === 0
      ? this.getTotalQty(0, '')
      : this.getTotalQty(this.userId ?? 0, '')
    ).pipe(
      catchError(() => of({ totalCart: 0 })) // Nếu API lỗi, trả về { totalCart: 0 }
    ).subscribe(total => {
      this.qtyTotal = total?.totalCart ?? 0; // Đảm bảo giá trị không phải null
      console.log('Total quantity in cart:', this.qtyTotal);
    });
  }

  // Định nghĩa qtyTotal với kiểu số
  qtyTotal: number = 0;


  getTotalQty(userId: number, sessionId: string): Observable<TotalQty | null> {
    return this.cartService.getTotalQty(userId, sessionId).pipe(
      map((response: ApiResponse<TotalQty>) => response?.data || null),
      catchError((error) => {
        console.error("Lỗi khi gọi API getTotalQty:", error);
        return of(null);
      })
    );
  }

  getBanners(lang: string): Observable<BannerDTO[] | null> {
    return this.bannerService.getBanners(lang).pipe(
      map((response: ApiResponse<BannerDTO[]>) => response.data || []),
      catchError(() => of(null))
    )
  }
 

}
