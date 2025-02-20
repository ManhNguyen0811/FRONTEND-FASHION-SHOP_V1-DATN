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
import {NavBottomComponent} from '../nav-bottom/nav-bottom.component';
import {Router} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {BannerService} from '../../../services/client/BannerService/banner.service';
import {catchError, firstValueFrom, map, Observable, of} from 'rxjs';
import {BannerDTO} from '../../../models/BannerDTO';
import {response} from 'express';
import {ApiResponse} from '../../../dto/Response/ApiResponse';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit ,AfterViewInit{
  currentLang: string = ''; // Ngôn ngữ mặc định
  currentCurrency: string = ''; // Tiền tệ mặc định
  url: string = '';
  banners: Observable<BannerDTO[] | null> = of([]);


  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private router: Router,
              private navigationService: NavigationService,
              private bannerService: BannerService,) {

  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.playVideo(), 500);

      // Đảm bảo phát video khi người dùng click vào trang
      document.addEventListener("click", this.playVideo);
    }
  }

  playVideo = (): void => {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const video = this.videoPlayer.nativeElement;
      video.muted = true;
      video.play().catch(err => console.log("Autoplay blocked:", err));
    }
  };

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.handleScroll(); // Gọi xử lý ban đầu khi load trang
    }

    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await  firstValueFrom(this.navigationService.currentCurrency$);
    this.banners =  this.getBanners(this.currentLang);
    console.log(this.banners);

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

  getBanners(lang: string): Observable<BannerDTO[] | null> {
    return this.bannerService.getBanners(lang).pipe(
      map((response: ApiResponse<BannerDTO[]>)=> response.data || []),
      catchError(() => of(null))
    )
  }


}
