import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { TableComponent } from '../../table/table.component';
import { PageResponse } from '../../../../dto/Response/page-response';
 
import { CategoryAdminService } from '../../../../services/admin/CategoryService/category.service';
import { catchError, firstValueFrom, forkJoin, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../../../dto/Response/ApiResponse';
import { CommonModule } from '@angular/common';
import { CategoryAdminDTO } from '../../../../dto/CategoryAdminDTO';
import { ToastrService } from 'ngx-toastr';
import { CategoryAdmin } from '../../../../models/Category/CategotyAdmin';

export interface TableDataModel {
  id: number;
  name: string;
  imageUrl: string;
  isActive: boolean;
  parentsID: number;
  parentsName: string;
  createdAt: string;
  updatedAt: string;
}
@Component({
  selector: 'app-list-category',
  standalone: true,
  imports: [HeaderAdminComponent, TableComponent,CommonModule],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})


export class ListCategoryComponent implements OnInit {
  headers: string[] = ['id', 'name', 'imageUrl', 'isActive', 'parentId', 'parentName', 'createdAt', 'updatedAt', 'button'];

  checkedItems: any[] = [];  // Danh sách các mục đã chọn, đã được khởi tạo

  page: number = 0
  size: number = 7
  sortBy: string = 'createdAt'
  sortDir: string = 'desc'

  dataPageCategory: PageResponse<CategoryAdmin[]> | null = null
  dataCategories: CategoryAdmin[]  = [];




  constructor(
    private categoryAdminService: CategoryAdminService,
    private toastService : ToastrService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.fetchCategory()


  }
  onPageChange(newPage: number): void {
    this.page = newPage;  // Cập nhật giá trị page
    this.fetchCategory(); // Gọi lại API với trang mới
  }

  
  async fetchCategory(): Promise<void> {

    const callApis = {
      dataCategories: this.getCategories(this.page, this.size, this.sortBy, this.sortDir).pipe(catchError(() => of(null)))
    }

    const response = await firstValueFrom(forkJoin(callApis))
    this.dataPageCategory = response.dataCategories
    this.dataCategories = response.dataCategories?.content?.flat() || [];

    console.log("dataPageCategory : " + this.dataPageCategory)

  }

  getCategories(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<PageResponse<CategoryAdmin[]>> {
    return this.categoryAdminService.getCategoriesAdmin(page, size, sortBy, sortDir).pipe(
      map((response: ApiResponse<PageResponse<CategoryAdmin[]>>) => response.data || null),
      catchError(() => of(null as any))
    )
  }

  clickNe(id: number) {
    console.log('Selected ID:', id);
  }



  toggleCheckbox(item: any) {
    if (!Array.isArray(this.checkedItems)) {
      this.checkedItems = [];  
    }

    item.checked = !item.checked;

    if (item.checked) {
      this.checkedItems.push(item);
    } else {
      const index = this.checkedItems.findIndex(i => i.id === item.id);
      if (index !== -1) {
        this.checkedItems.splice(index, 1);
      }
    }

    console.log(item.checked);
    console.log(item.ParentsID);
    console.log(item.id);
    console.log(this.checkedItems);
  }




  createCategoryNew() {

    const sampleCategory: CategoryAdminDTO = {
      parentId: 1,
      translations: [
        { languageCode: 'vi', name: 'Áo' },
        { languageCode: 'en', name: 'T-SHIRTS, SWEAT & FLEECE MANH 1' },
        { languageCode: 'jp', name: 'アウターウェア' }
      ]
    };

    // Tạo Blob và File cho hình ảnh
    const sampleFileContent = new Blob(['Sample image content'], { type: 'image/png' });
    const selectedFile = new File([sampleFileContent], "sample.png", { type: 'image/png' });

    // Tạo FormData để gửi cả JSON và file
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(sampleCategory)], { type: 'application/json' }));
    formData.append('imageFile', selectedFile, selectedFile.name);

    // Gọi API
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

