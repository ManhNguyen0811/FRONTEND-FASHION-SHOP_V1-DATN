import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.handleScroll(); // Gọi xử lý ban đầu khi load trang
    }
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
}
