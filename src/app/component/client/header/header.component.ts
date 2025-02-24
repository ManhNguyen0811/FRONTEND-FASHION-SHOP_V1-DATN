import {NgClass, CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { NavigationEnd, Router, RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import { NavigationService} from '../../../services/Navigation/navigation.service';
import {LanguageDTO} from '../../../dto/LanguageDTO';
import {CurrencyDTO} from '../../../dto/CurrencyDTO';
import {CategoryService} from '../../../services/client/CategoryService/category.service';
import {CategoryDTO} from '../../../dto/CategoryDTO';
import {WishlistService} from '../../../services/client/wishlist/wishlist.service';
import {Observable} from 'rxjs';
import {TokenService} from '../../../services/token/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, TranslateModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  languageList: LanguageDTO[] = [];
  currencyList: CurrencyDTO[] = [];
  categoriesParent: CategoryDTO[] = [];
  apiError: any;
  isHome: boolean = false;
  currentLang: string = ''; // Ngôn ngữ mặc định
  currentCurrency: string = ''; // Tiền tệ mặc định
  isSearchActive: boolean = false;

  userId: number = 0;
  totalWishlist$!: Observable<number>;


  constructor(private router: Router,
              private navigationService: NavigationService,
              private categoryService: CategoryService,
              private wishlistService: WishlistService,
              private tokenService: TokenService) {
    // Lắng nghe sự kiện NavigationEnd để kiểm tra URL hiện tại
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Kiểm tra nếu URL hiện tại là trang Home
        const segments = this.router.url.split('/');
        this.isHome = segments.length === 4 && segments[1] === 'client';
      }
    });

    // Lắng nghe giá trị ngôn ngữ và tiền tệ từ NavigationService
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });

    this.navigationService.currentCurrency$.subscribe((currency) => {
      this.currentCurrency = currency;
    });

    // Subscribe để nhận giá trị từ service
    this.navigationService.isSearchActive$.subscribe((value) => {
      this.isSearchActive = value;
    });
  }



  changeLanguageAndCurrency(lang: string) {
    // Cập nhật giá trị ngôn ngữ và tiền tệ trong NavigationService
    let currency: string= "";
    if(lang === "vi"){
      currency = "vnd";
    }else if(lang === "en"){
      currency = "usd";
    }else if(lang === "jp"){
      currency = "jpy";
    }
    this.navigationService.updateLang(lang);
    this.navigationService.updateCurrency(currency);
    this.getCategoriesParent(this.currentLang);
    // Tạo URL mới với ngôn ngữ và tiền tệ đã thay đổi
    const updatedUrl = this.router.url.replace(
      /\/client\/[^\/]+\/[^\/]+/,
      `/client/${currency}/${lang}`
    );

    // Điều hướng đến URL mới
    this.router.navigateByUrl(updatedUrl);

    window.location.href = updatedUrl;
  }

  getLanguage(): void {
    this.navigationService.getLanguage().subscribe({
      next: (languages: LanguageDTO[]) => {
        this.languageList = languages;
      },
      error: (err) => console.error(err)
    });
  }

  getCurrency(): void {
    this.navigationService.getCurrency().subscribe({
      next: (currencies: CurrencyDTO[]) => {
        this.currencyList = currencies;
      },
      error: (err) => console.error(err)
    });
  }


  getCategoriesParent(lang: string){

    this.categoryService.getCategoryParent(lang).subscribe({
      next: (response) => {
        this.categoriesParent = response.data;
        this.apiError = response.errors;
      },
      error: (err) => {
        console.log('Http Error: ',err);
        console.log('Lỗi: ',this.apiError);
      }
    })
  }



  onCategoryClick( parentId: number): void {
    // Lấy ngôn ngữ hiện tại
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    // lấy category theo ngôn ngữ và parentId
    this.categoryService.loadCategories(this.currentLang, parentId);
  }

  ngOnInit(): void {
    this.getLanguage();
    this.getCurrency();
    this.getCategoriesParent(this.currentLang);
    this.categoryService.loadCategories(this.currentLang,1);
    this.totalWishlist$ = this.wishlistService.totalWishlist$;
    this.userId = this.tokenService.getUserId();
    if(this.userId){
      this.wishlistService.getWishlistTotal(this.userId)
    }
  }
}
