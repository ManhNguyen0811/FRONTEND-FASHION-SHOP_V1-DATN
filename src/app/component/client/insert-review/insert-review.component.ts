import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProvinceService} from '../../../services/Province/province.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insert-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './insert-review.component.html',
  styleUrl: './insert-review.component.scss'
})
export class InsertReviewComponent implements OnInit{
  reviewForm: FormGroup;

  // Variables for UI
  selectedRating: number = 0;
  ratingText: string = '';
  fitValue: number = 3; // Default "Đúng với kích thước"
  provinces: any[] = [];

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

  constructor(private fb: FormBuilder) {
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

  // ngOnInit(): void {
  //   this.locationService.getProvinces().subscribe((data) => {
  //     this.provinces = data; // Populate provinces dropdown
  //   });
  // }

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
  }

  ngOnInit(): void {
  }

}
