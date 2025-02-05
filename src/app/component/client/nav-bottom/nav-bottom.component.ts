import { CommonModule, NgClass } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {Router, RouterLink} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {TranslatePipe} from '@ngx-translate/core';
import {CategoryDTO} from '../../../dto/CategoryDTO';
import {CategoryService} from '../../../services/client/CategoryService/category.service';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-nav-bottom',
  standalone: true,
  imports: [NgClass,
    CommonModule,
    HeaderComponent,
    RouterLink, TranslatePipe],
  templateUrl: './nav-bottom.component.html',
  styleUrl: './nav-bottom.component.scss'
})
export class NavBottomComponent implements OnInit{
  currentLang: string = 'vi'; // Ngôn ngữ mặc định
  currentCurrency: string = 'vn'; // Tiền tệ mặc định
  categories$: Observable<CategoryDTO[]> = of([]);
  categoriesChid: CategoryDTO[] = [];
  selectedCategory!: Observable<CategoryDTO>;
  apiError: any;
  constructor(private router: Router,private navigationService: NavigationService, private categoryService: CategoryService) {
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


  isSearchActive: boolean = false;

  toggleSearch(): void {
    this.navigationService.toggleSearchActive();
  }


  currentLevel: number = 2;



  onCategoryChildClick( parentId: number): void {
    // Lấy ngôn ngữ hiện tại
    this.navigationService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
    // lấy category được click
    this.selectedCategory = this.categoryService.getCategory(this.currentLang, parentId);

    // lấy category theo ngôn ngữ và parentId
    this.categoryService.getCategories(this.currentLang, parentId).subscribe({
      next: (response) => {
        this.categoriesChid = response.data;
        this.apiError = response.errors;
      },
      error: (err) => {
        console.log('Http Error: ',err);
        console.log('Lỗi: ',this.apiError);
      }
    })
    this.currentLevel = 3; // Chuyển sang tầng 3
  }

// Hàm quay lại tầng 2
  goBack(): void {
    this.currentLevel = 2; // Quay lại tầng 2
  }


  ngOnInit(): void {
    this.categories$ = this.categoryService.categories$; // Subscribe vào Observable từ service
  }

}
