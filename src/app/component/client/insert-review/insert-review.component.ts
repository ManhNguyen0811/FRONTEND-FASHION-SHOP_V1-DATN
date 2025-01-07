import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-insert-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './insert-review.component.html',
  styleUrl: './insert-review.component.scss'
})
export class InsertReviewComponent implements OnInit{
  currentLang: string = 'vi';
  currentCurrency: string = 'vn';

  navigateTo(route: string){
    this.navigationService.navigateTo(route);
  }

  toggleLanguageAndCurrency() {
    if (this.currentLang === 'vi') {
      this.changeLanguageAndCurrency('en', 'us'); // Đổi sang tiếng Anh
    } else {
      this.changeLanguageAndCurrency('vi', 'vn'); // Đổi sang tiếng Việt
    }
  }

  changeLanguageAndCurrency(lang: string, currency: string) {
    this.currentLang = lang; // Cập nhật ngôn ngữ trong UI
    this.currentCurrency = currency; // Cập nhật tiền tệ trong UI
    this.navigationService.updateLangAndCurrency(lang, currency); // Gọi service để cập nhật URL
  }


  reviewForm: FormGroup;

  // Variables for UI
  selectedRating: number = 0;
  ratingText: string = '';
  fitValue: number = 3; // Default "Đúng với kích thước"

  // Static data
  //Kích cỡ đã mua
  sizes = [
    {size : 'XS' },
    {size : 'S' },
    {size : 'M' },
    {size : 'L' },
    {size : 'XL' },
    {size : 'XXL' }
  ];
  //Giới tính
  genders = [
    {gender: 'Nam'},
    {gender: 'Nữ'},
    {gender: 'Khác'}
  ];
  //Độ tuổi
  ages = [
    { age: '0 đến 6 tháng' },
    { age: '7 đến 12 tháng' },
    { age: '13 đến 24 tháng' },
    { age: '2 đến 3 tuổi' },
    { age: '4 đến 6 tuổi' },
    { age: '7 đến 9 tuổi' },
    { age: '10 đến 14 tuổi' },
    { age: '15 đến 19 tuổi' },
    { age: '20 đến 24 tuổi' },
    { age: '25 đến 34 tuổi' },
    { age: '35 đến 44 tuổi' },
    { age: '45 đến 54 tuổi' },
    { age: '55 đến 64 tuổi' },
    { age: '65 tuổi và hơn' }
  ];
  //Chiều cao
  heights = [
    { height: '50cm trở xuống' },
    { height: '51 - 60cm' },
    { height: '61 - 70cm' },
    { height: '71 - 80cm' },
    { height: '81 - 90cm' },
    { height: '91 - 100cm' },
    { height: '101 - 110cm' },
    { height: '111 - 120cm' },
    { height: '121 - 130cm' },
    { height: '131 - 140cm' },
    { height: '141 - 150cm' },
    { height: '151 - 155cm' },
    { height: '156 - 160cm' },
    { height: '161 - 165cm' },
    { height: '166 - 170cm' },
    { height: '171 - 175cm' },
    { height: '176 - 180cm' },
    { height: '181 - 185cm' },
    { height: '186 - 190cm' },
  ];
  //Cân nặng
  weights = [
    { weight: '5kg trở xuống' },
    { weight: '5 - 8kg' },
    { weight: '9 - 12kg' },
    { weight: '13 - 15kg' },
    { weight: '16 - 20kg' },
    { weight: '21 - 25kg' },
    { weight: '26 - 30kg' },
    { weight: '31 - 35kg' },
    { weight: '36 - 40kg' },
    { weight: '41 - 45kg' },
    { weight: '46 - 50kg' },
    { weight: '51 - 55kg' },
    { weight: '56 - 60kg' },
    { weight: '61 - 65kg' },
    { weight: '66 - 70kg' },
    { weight: '71 - 75kg' },
    { weight: '76 - 80kg' },
    { weight: '81 - 85kg' },
    { weight: '86 - 90kg' },
  ];

  //Cỡ giày
  shoeSizes = [
    { size: 'EU33 trở xuống' },
    { size: 'EU34' },
    { size: 'EU35' },
    { size: 'EU36' },
    { size: 'EU37' },
    { size: 'EU38' },
    { size: 'EU39' },
    { size: 'EU40' },
    { size: 'EU41' },
    { size: 'EU42' },
    { size: 'EU43' },
    { size: 'EU44' },
    { size: 'EU45' },
    { size: 'EU46' },
    { size: 'EU47' },
    { size: 'EU48' },
    { size: 'EU49' },
    { size: 'EU50 trở lên' },
  ];

  provinces = [
    "Hà Nội",
    "Hà Giang",
    "Cao Bằng",
    "Bắc Kạn",
    "Tuyên Quang",
    "Lào Cai",
    "Điện Biên",
    "Lai Châu",
    "Sơn La",
    "Yên Bái",
    "Hòa Bình",
    "Thái Nguyên",
    "Lạng Sơn",
    "Quảng Ninh",
    "Bắc Giang",
    "Phú Thọ",
    "Vĩnh Phúc",
    "Bắc Ninh",
    "Hải Dương",
    "Hải Phòng",
    "Hưng Yên",
    "Thái Bình",
    "Hà Nam",
    "Nam Định",
    "Ninh Bình",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên Huế",
    "Đà Nẵng",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
    "Bình Phước",
    "Tây Ninh",
    "Bình Dương",
    "Đồng Nai",
    "Bà Rịa - Vũng Tàu",
    "Hồ Chí Minh",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Trà Vinh",
    "Vĩnh Long",
    "Đồng Tháp",
    "An Giang",
    "Kiên Giang",
    "Cần Thơ",
    "Hậu Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau"
  ];


  constructor(private fb: FormBuilder, private navigationService: NavigationService, private router: Router) {
    this.reviewForm = this.fb.group({
      rating: [0, Validators.required],
      fit: [3, Validators.required],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      comment: ['', [Validators.required, Validators.minLength(50)]],
      sizePurchased: ['', Validators.required],
      nickname: ['', Validators.required],
      gender: ['', Validators.required],
      location: ['', Validators.required],
      age: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      shoeSize: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
  }


  // Handlers
  setRating(rating: number): void {
    this.selectedRating = rating;
    this.ratingText = this.getRatingText(rating);
    this.reviewForm.controls['rating'].setValue(rating);
  }

  setFitValue(value: number): void {
    this.fitValue = value;
    this.reviewForm.controls['fit'].setValue(value);

  }

  getRatingText(rating: number): string {
    switch (rating) {
      case 1: return 'Kém';
      case 2: return 'Được';
      case 3: return 'Trung bình';
      case 4: return 'Tốt';
      case 5: return 'Rất tốt';
      default: return '';
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value); // Send form data to backend
    } else {
      console.log('Form is invalid:', this.reviewForm.errors);
      Object.keys(this.reviewForm.controls).forEach(key => {
        const controlErrors = this.reviewForm.get(key)?.errors;
        if (controlErrors) {
          console.log(`Control ${key} errors:`, controlErrors);
        }
      });
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Cập nhật ngôn ngữ và tiền tệ từ Service
        this.currentLang = this.navigationService.getCurrentLang();
        this.currentCurrency = this.navigationService.getCurrentCurrency();
      });
  }

  ngOnInit(): void {

  }

}
