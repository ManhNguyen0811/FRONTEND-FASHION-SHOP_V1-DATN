import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';
import { LanguagesService } from '../../../../services/LanguagesService/languages.service';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ApiResponse } from '../../../../dto/Response/ApiResponse';
import { LanguageDTO } from '../../../../dto/LanguageDTO';
import { CategoryAdminService } from '../../../../services/admin/CategoryService/category.service';
import { CategoryAdminDTO, TranslationDTO } from '../../../../dto/CategoryAdminDTO';
import { ToastrService } from 'ngx-toastr';
import { CategoryDTO } from '../../../../dto/CategoryDTO';
import { response } from 'express';

// Interface Category với thuộc tính image
interface Category {
  id: number;
  name: string;
  image?: string;
  isActive: boolean
  subCategories: Category[];
}

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [HeaderAdminComponent, RouterLink, CommonModule, FormsModule, ButtonComponent],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'] // Đã sửa styleUrl -> styleUrls
})
export class EditCategoryComponent implements OnInit {
  // --------------------------
  // Dữ liệu Category (Fake data)
  // --------------------------
  listCategory: Category[] = []
  dataParentCategories: CategoryDTO[] =[] 

  // --------------------------
  // Biến định danh & danh sách con
  // --------------------------
  id!: number;
  parentId?: any 
  categoryChildren: Category[] = [];
  categorySubChildren: Category[] = [];
  categorySubSubChildren: Category[] = [];

  // --------------------------
  // Ngôn ngữ & Translation
  // --------------------------
  dataLanguages: LanguageDTO[] = [];
  translations: TranslationDTO[] = this.dataLanguages.map(lang => ({
    languageCode: lang.code,
    name: ''
  }));

  // --------------------------
  // Custom select: Sản phẩm (Ví dụ)
  // --------------------------
  isOpen: boolean = false;
  searchText: string = '';
  selectedItem: any = null;
 

  // --------------------------
  // Custom select: Category Parent
  // --------------------------
  isOpenCategoryParent: boolean = false;
  searchTextCategoryParent: string = '';
  selectedCategoryParent: Category | null = null;

  // --------------------------
  // Custom select: Category Child
  // --------------------------
  isOpenCategoryChild: boolean = false;
  searchTextCategoryChild: string = '';
  selectedCategoryChild: Category | null = null;

  // --------------------------
  // Custom select: Category Sub Child
  // --------------------------
  isOpenCategorySubChild: boolean = false;
  searchTextCategorySubChild: string = '';
  selectedCategorySubChild: Category | null = null;

  // --------------------------
  // File upload
  // --------------------------
  imageUrl: string | ArrayBuffer | null =
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fselect&psig=AOvVaw3iX_RNzrj9MCTjoX16_K4t&ust=1740018486796000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCjh5PYzosDFQAAAAAdAAAAABAE';
  selectedFile: File | null = null;

  // --------------------------
  // Category Admin & New Category
  // --------------------------
  categoryNew: CategoryAdminDTO = {
    parentId: 0,
    translations: []
  };

  // --------------------------
  // CONSTRUCTOR & NGONINIT
  // --------------------------
  constructor(
    private route: ActivatedRoute,
    private languagesSrevice: LanguagesService,
    private categoryAdminService: CategoryAdminService,
    private toastService: ToastrService
  ) { }

  async ngOnInit(): Promise<void> {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Received ID:', this.id);
    await this.fetchCategory();
    this.listCategory = await firstValueFrom(this.buildCategoryTree());
    console.log(this.listCategory[0].subCategories)
  }

  // --------------------------
  // HÀM XỬ LÝ NGÔN NGỮ & TRANSLATION
  // --------------------------
  getTranslationByCode(code: string): TranslationDTO {
    const translation = this.translations.find(item => item.languageCode === code);
    return translation ? translation : { languageCode: code, name: '' };
  }

  logValues(): void {
    console.log(this.translations);
  }

  getLanguages(): Observable<LanguageDTO[]> {
    return this.languagesSrevice.getLanguages().pipe(
      map((response: ApiResponse<LanguageDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
  }

  async fetchCategory(): Promise<void> {
    const callApis = {
      dataLanguages: this.getLanguages().pipe(catchError(() => of([]))),
      dataParentCategory:  this.getParentCategories().pipe(catchError(() => of([])))
    };

    const response = await firstValueFrom(forkJoin(callApis));
    this.dataLanguages = response.dataLanguages;
    this.dataParentCategories = response.dataParentCategory
    // console.log("object: "+this.dataParentCategories )

    if (this.dataLanguages.length > 0) {
      this.initializeTranslations();
    } else {
      console.log('Không có dữ liệu ngôn ngữ');
    }
  }

  buildCategoryTree(): Observable<Category[]> {
    // Giả sử this.dataParentCategories đã được load từ API (kiểu CategoryDTO[])
    return forkJoin(
      this.dataParentCategories.map((parentDto: CategoryDTO) => {
        // Chuyển đổi CategoryDTO của cha sang Category
        const parent: Category = {
          id: parentDto.id,
          name: parentDto.name,
          image: parentDto.imageUrl,
          isActive: parentDto.isActive,
          subCategories: []
        };
  
        // Lấy danh sách con của parent (tầng 2)
        return this.getChildCategories(parent.id).pipe(
          switchMap((childDtos: CategoryDTO[]) => {
            if (childDtos.length > 0) {
              // Với mỗi child, chuyển sang Category và lấy con của nó (tầng 3)
              return forkJoin(
                childDtos.map(childDto => {
                  const child: Category = {
                    id: childDto.id,
                    name: childDto.name,
                    image: childDto.imageUrl,
                    isActive: childDto.isActive,
                    subCategories: []
                  };
  
                  // Lấy con của child (tầng 3)
                  return this.getChildCategories(child.id).pipe(
                    map((grandChildDtos: CategoryDTO[]) => {
                      child.subCategories = grandChildDtos.map(grandChildDto => ({
                        id: grandChildDto.id,
                        name: grandChildDto.name,
                        image: grandChildDto.imageUrl,
                        isActive: grandChildDto.isActive,
                        subCategories: [] // Không cần tầng con tiếp theo
                      }));
                      return child;
                    })
                  );
                })
              ).pipe(
                map((children: Category[]) => {
                  parent.subCategories = children;
                  return parent;
                })
              );
            } else {
              parent.subCategories = [];
              return of(parent);
            }
          })
        );
      })
    );
  }
  

  getParentCategories(): Observable<CategoryDTO[]>{
    return this.categoryAdminService.getParentCategories().pipe(
      map((response :  ApiResponse<CategoryDTO[]>) => response.data || []),
      catchError(() => of ([]))
    )
  }
  getChildCategories(parentId: number): Observable<CategoryDTO[]> {
 
    return this.categoryAdminService.getSubCategoriesByParentId(parentId).pipe(
      map((response : ApiResponse<CategoryDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
  }

  initializeTranslations(): void {
    this.translations = this.dataLanguages.map(lang => ({
      languageCode: lang.code,
      name: ''
    }));
  }

  // --------------------------
  // HÀM XỬ LÝ TÍNH NĂNG TÌM KIẾM (TỪNG CUSTOM SELECT)
  // --------------------------
  removeVietnameseTones(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }




  filteredCategoriesParent(): Category[] {
    const search = this.removeVietnameseTones(this.searchTextCategoryParent.trim().toLowerCase());
    return search ? this.listCategory.filter(category =>
      this.removeVietnameseTones(category.name.toLowerCase()).includes(search)
    ) : this.listCategory;
  }

  filteredCategoriesChild(): Category[] {
    const search = this.removeVietnameseTones(this.searchTextCategoryChild.trim().toLowerCase());
    return search ? this.categoryChildren.filter(category =>
      this.removeVietnameseTones(category.name.toLowerCase()).includes(search)
    ) : this.categoryChildren;
  }

  filteredCategoriesSubChild(): Category[] {
    const search = this.removeVietnameseTones(this.searchTextCategorySubChild.trim().toLowerCase());
    return search ? this.categorySubChildren.filter(category =>
      this.removeVietnameseTones(category.name.toLowerCase()).includes(search)
    ) : this.categorySubChildren;
  }

  // --------------------------
  // HÀM XỬ LÝ CUSTOM SELECT CHO CATEGORY
  // --------------------------
  selectCategoryParent(category: Category): void {
    this.selectedCategoryParent = category;
    this.isOpenCategoryParent = false;
    this.searchTextCategoryParent = '';
    
    // Reset các lựa chọn cấp con
    this.selectedCategoryChild = null;
    this.selectedCategorySubChild = null;
    this.categoryChildren = [];
    this.categorySubChildren = [];
    this.categorySubSubChildren = [];
    
    this.getListCategoryChild(category.id);
  }
  
  selectCategoryChild(category: Category): void {
    this.selectedCategoryChild = category;
    this.isOpenCategoryChild = false;
    this.searchTextCategoryChild = '';
    
    // Reset lựa chọn cấp con dưới
    this.selectedCategorySubChild = null;
    this.categorySubChildren = [];
    this.categorySubSubChildren = [];
    
    this.getListCategorySubChild(category.id);
  }
  
  selectCategorySubChild(category: Category): void {
    this.selectedCategorySubChild = category;
    this.isOpenCategorySubChild = false;
    this.searchTextCategorySubChild = '';
    this.getListCategorySubSubChild(category.id);
  }
  

  selectItem(item: any): void {
    this.selectedItem = item;
    this.isOpen = false;
    this.searchText = '';
    console.log(item.id);
  }

  // --------------------------
  // HÀM XỬ LÝ DANH SÁCH CATEGORY CON
  // --------------------------
  getListCategoryChild(categoriesIdChild: number | undefined): Category[] {
    if (categoriesIdChild !== undefined) {
      this.parentId = categoriesIdChild;
      console.log("parentId: " + this.parentId);
      const selectedCategory = this.listCategory.find(category => category.id === Number(categoriesIdChild));
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

  getListCategorySubChild(categoriesIdChild: number | undefined): Category[] {
    if (categoriesIdChild !== undefined) {
      this.parentId = categoriesIdChild;
      console.log("parentId: " + this.parentId);
      const selectedCategory = this.categoryChildren.find(category => category.id === Number(categoriesIdChild));
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
      this.parentId = categoriesIdChild;
      console.log("Sub-Sub ParentId: " + categoriesIdChild);
      const selectedCategory = this.categorySubChildren.find(category => category.id === Number(categoriesIdChild));
      this.categorySubSubChildren = selectedCategory ? selectedCategory.subCategories : [];
    }
  }

  // --------------------------
  // HÀM UPLOAD ẢNH
  // --------------------------
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log("File Name:", this.selectedFile.name);
      console.log("File Type:", this.selectedFile.type);
      console.log("File Size:", this.selectedFile.size, "bytes");

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // --------------------------
  // HÀM TẠO CATEGORY MỚI
  // --------------------------
  createCategoryNew = (): void => {
   
    if (!this.translations || this.translations.length === 0) {
      this.toastService.error('Vui lòng thêm ít nhất một translation!', "Error", { timeOut: 3000 });
      return;
    }
    for (const translation of this.translations) {
      if (!translation.languageCode || !translation.name) {
        this.toastService.error('Mỗi translation phải có đầy đủ languageCode và name!', "Error", { timeOut: 3000 });
        return;
      }
    }

    if (!this.parentId) {
      // this.toastService.error('Vui lòng thêm Parent ID!', "Error", { timeOut: 3000 });
      this.parentId === '' 
 
    }

    const sampleCategory: CategoryAdminDTO = {
      parentId: this.parentId,
      translations: this.translations
    };

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(sampleCategory)], { type: 'application/json' }));

    if (!this.selectedFile) {
      this.toastService.error('Vui lòng chọn một file ảnh!', "Error", { timeOut: 3000 });
      return;
    }
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

    this.categoryAdminService.createCategory(formData).subscribe({
      next: response => {
        this.toastService.success('Success', 'Category created successfully!', { timeOut: 3000 });
        this.resetForm()
      },
      error: error => {
        this.toastService.error('Error', 'There was an error creating the category.', { timeOut: 3000 });
        console.log(error);
      }
    });
  }

  resetForm(): void {
    this.categoryNew = {
      parentId: 0,
      translations: []
    };
    // Nếu có các giá trị khác cần reset, bạn có thể reset thêm ở đây, ví dụ:
    this.selectedFile = null;
    this.imageUrl = null;
    this.fetchCategory()
    // Reset các biến khác (nếu cần)
  }
  
  
}
