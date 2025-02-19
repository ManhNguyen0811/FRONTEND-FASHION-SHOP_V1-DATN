import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';
import { LanguagesService } from '../../../../services/LanguagesService/languages.service';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, timeout } from 'rxjs';

import { ApiResponse } from '../../../../dto/Response/ApiResponse';
import { LanguageDTO } from '../../../../dto/LanguageDTO';
import { PageResponse } from '../../../../dto/Response/page-response';
import { CategoryService } from '../../../../services/client/CategoryService/category.service';
import { CategoryAdminService } from '../../../../services/admin/CategoryService/category.service';
import { CategoryAdminDTO, TranslationDTO } from '../../../../dto/CategoryAdminDTO';
import { ToastrService } from 'ngx-toastr';

interface Category {
  id: number,
  name: string,
  subCategories: Category[]
}

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [HeaderAdminComponent, RouterLink, CommonModule, FormsModule, ButtonComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  listCategory: Category[] = [
    {
      id: 1,
      name: 'Nam', // Tầng 1
      subCategories: [
        {
          id: 11,
          name: 'Áo Nam', // Tầng 2
          subCategories: [
            {
              id: 111,
              name: 'Áo Sơ Mi Nam', // Tầng 3
              subCategories: [
                { id: 1111, name: 'Áo Sơ Mi Nam Đặc Biệt', subCategories: [] },
                { id: 1112, name: 'Áo Sơ Mi Nam Công Sở', subCategories: [] }
              ]
            },
            {
              id: 112,
              name: 'Áo Thun Nam', // Tầng 3
              subCategories: [
                { id: 1121, name: 'Áo Thun Nam Mùa Hè', subCategories: [] },
                { id: 1122, name: 'Áo Thun Nam Mùa Đông', subCategories: [] }
              ]
            }
          ]
        },
        {
          id: 12,
          name: 'Giày Nam', // Tầng 2
          subCategories: [
            {
              id: 121,
              name: 'Giày Sneaker Nam', // Tầng 3
              subCategories: [
                { id: 1211, name: 'Giày Sneaker Nam Da', subCategories: [] },
                { id: 1212, name: 'Giày Sneaker Nam Vải', subCategories: [] }
              ]
            },
            {
              id: 122,
              name: 'Giày Tây Nam', // Tầng 3
              subCategories: [
                { id: 1221, name: 'Giày Tây Nam Chính Hãng', subCategories: [] },
                { id: 1222, name: 'Giày Tây Nam Cổ Điển', subCategories: [] }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Nữ', // Tầng 1
      subCategories: [
        {
          id: 21,
          name: 'Áo Nữ', // Tầng 2
          subCategories: [
            {
              id: 211,
              name: 'Áo Sơ Mi Nữ', // Tầng 3
              subCategories: [
                { id: 2111, name: 'Áo Sơ Mi Nữ Đặc Biệt', subCategories: [] },
                { id: 2112, name: 'Áo Sơ Mi Nữ Công Sở', subCategories: [] }
              ]
            },
            {
              id: 212,
              name: 'Áo Thun Nữ', // Tầng 3
              subCategories: [
                { id: 2121, name: 'Áo Thun Nữ Mùa Hè', subCategories: [] },
                { id: 2122, name: 'Áo Thun Nữ Mùa Đông', subCategories: [] }
              ]
            }
          ]
        },
        {
          id: 22,
          name: 'Giày Nữ', // Tầng 2
          subCategories: [
            {
              id: 221,
              name: 'Giày Sneaker Nữ', // Tầng 3
              subCategories: [
                { id: 2211, name: 'Giày Sneaker Nữ Da', subCategories: [] },
                { id: 2212, name: 'Giày Sneaker Nữ Vải', subCategories: [] }
              ]
            },
            {
              id: 222,
              name: 'Giày Cao Gót Nữ', // Tầng 3
              subCategories: [
                { id: 2221, name: 'Giày Cao Gót Nữ Chính Hãng', subCategories: [] },
                { id: 2222, name: 'Giày Cao Gót Nữ Thời Trang', subCategories: [] }
              ]
            }
          ]
        }
      ]
    }
  ];

  id!: number;

  selectIdChild: number | undefined;
  selectIdSubChild: number | undefined;
  selectIdSubSubChild: number | undefined;
  parentId: number = 0

  // Các danh sách con và sub-con
  categoryChildren: Category[] = [];
  categorySubChildren: Category[] = [];
  categorySubSubChildren: Category[] = [];


  dataLanguages: LanguageDTO[] = []




  categoryAdminDTO: CategoryAdminDTO[] = []
  translations: TranslationDTO[] = this.dataLanguages.map(lang => ({
    languageCode: lang.code,
    name: ''
  }));


  getTranslationByCode(code: string): TranslationDTO {
    const translation = this.translations.find(item => item.languageCode === code);
    if (!translation) {
      return { languageCode: code, name: '' };
    }
    return translation;
  }



  logValues() {
    console.log(this.translations);
  }
  constructor(
    private route: ActivatedRoute,
    private languagesSrevice: LanguagesService,
    private categoryAdminService: CategoryAdminService,
    private toastService: ToastrService
  ) {

  }
  categoryNew: CategoryAdminDTO = {
    parentId: 0,
    translations: []
  };

  initializeTranslations() {
    this.translations = this.dataLanguages.map(lang => ({
      languageCode: lang.code,
      name: ''  // Mặc định, name rỗng cho các ngôn ngữ
    }));
  }

  async ngOnInit(): Promise<void> {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Received ID:', this.id);
    await this.fetchCategory();
  }

  async fetchCategory(): Promise<void> {
    const callApis = {
      dataLanguages: this.getLanguages().pipe(catchError(() => of([]))),
    }

    const response = await firstValueFrom(forkJoin(callApis))
    this.dataLanguages = response.dataLanguages;

    // Khởi tạo translations sau khi đã có dữ liệu languages
    if (this.dataLanguages.length > 0) {
      this.initializeTranslations();
    } else {
      console.log('Không có dữ liệu ngôn ngữ');
    }
  }


  getLanguages(): Observable<LanguageDTO[]> {
    return this.languagesSrevice.getLanguages().pipe(
      map((response: ApiResponse<LanguageDTO[]>) => response.data || []),
      catchError(() => of([]))
    )
  }



  getListCategoryChild(categoriesIdChild: number | undefined): Category[] {
    if (categoriesIdChild !== undefined) {
      this.parentId = categoriesIdChild
      console.log("parentId: " + this.parentId)
      const categoriesIdChildNumber = Number(categoriesIdChild);
      const selectedCategory = this.listCategory.find(category => category.id === categoriesIdChildNumber);

      if (selectedCategory) {
        this.categoryChildren = selectedCategory.subCategories;
        return this.categoryChildren;
      } else {
        console.log('Không tìm thấy category với id:', categoriesIdChild);
        return [];
      }
    }
    return [];
  }

  // Lấy danh sách các category con của category con
  getListCategorySubChild(categoriesIdChild: number | undefined): Category[] {
    if (categoriesIdChild !== undefined) {
      this.parentId = categoriesIdChild
      console.log("parentId: " + this.parentId)
      const categoriesIdSubChildNumber = Number(categoriesIdChild);
      const selectedCategory = this.categoryChildren.find(category => category.id === categoriesIdSubChildNumber);

      if (selectedCategory) {
        this.categorySubChildren = selectedCategory.subCategories;
        return this.categorySubChildren;
      } else {
        console.log('Không tìm thấy category con với id:', categoriesIdChild);
        return [];
      }
    }
    return [];

  }
  getListCategorySubSubChild(categoriesIdChild: number | undefined): void {
    if (categoriesIdChild !== undefined) {
      this.parentId = categoriesIdChild

      this.selectIdSubSubChild = categoriesIdChild;
      console.log("Sub-Sub ParentId: " + this.selectIdSubSubChild);

      const selectedCategory = this.categorySubChildren.find(category => category.id === categoriesIdChild);
      if (selectedCategory) {
        this.categorySubSubChildren = selectedCategory.subCategories;
      } else {
        this.categorySubSubChildren = [];
      }
    }
  }







  clickEvent() {
    console.log("aaaaa");
    this.createCategoryNew()
  }


  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      console.log("File Name:", this.selectedFile.name);
      console.log("File Type:", this.selectedFile.type);
      console.log("File Size:", this.selectedFile.size, "bytes");


      // Hiển thị ảnh
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = reader.result; // Lưu URL của ảnh để hiển thị
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  createCategoryNew = () => {

    // Kiểm tra parentId
    if (!this.parentId) {
      this.toastService.error('Vui lòng thêm Parent ID!', "Error", { timeOut: 3000 });
      return;
    }

    // Kiểm tra danh sách translations
    if (!this.translations || this.translations.length === 0) {
      this.toastService.error('Vui lòng thêm ít nhất một translation!', "Error", { timeOut: 3000 });
      return;
    }

    // Kiểm tra từng translation (phải có languageCode & name)
    for (const translation of this.translations) {
      if (!translation.languageCode || !translation.name) {
        this.toastService.error('Mỗi translation phải có đầy đủ languageCode và name!', "Error", { timeOut: 3000 });
        return;
      }
    }


    const sampleCategory: CategoryAdminDTO = {
      parentId: this.parentId,
      translations: this.translations
    };

    // Tạo FormData
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(sampleCategory)], { type: 'application/json' }));

    // Kiểm tra file hình ảnh
    if (!this.selectedFile) {
      this.toastService.error('Vui lòng chọn một file ảnh!', "Error", { timeOut: 3000 });
      return;
    }
      if (this.selectedFile) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(this.selectedFile.type)) {
          this.toastService.error('Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, WEBP)', "Error", { timeOut: 3000 });
          return;
        }

        if (this.selectedFile.size > maxSize) {
          this.toastService.error('Dung lượng ảnh không được vượt quá 5MB!', "Error", { timeOut: 3000 });
          return;
        }

        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      } else {
        console.warn("Không có file ảnh nào được chọn!");
      }
   
    // Gửi request API
    this.categoryAdminService.createCategory(formData).subscribe({
      next: response => {
        this.toastService.success('Success', 'Category created successfully!', { timeOut: 3000 });
      },
      error: error => {
        this.toastService.error('Error', 'There was an error creating the category.', { timeOut: 3000 });
        console.log(error);
      }
    });
  }

}