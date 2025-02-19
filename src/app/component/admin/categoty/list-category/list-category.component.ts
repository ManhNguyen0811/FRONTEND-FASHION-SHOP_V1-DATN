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
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EditOrderComponent } from '../../order/edit-order/edit-order.component';
import { DialogComponent } from '../../dialog/dialog.component';

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

  imports: [HeaderAdminComponent, TableComponent, CommonModule, FormsModule, MatDialogModule, DialogComponent],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})


export class ListCategoryComponent implements OnInit {
  headers: string[] = ['id', 'name', 'imageUrl', 'isActive', 'parentId', 'parentName', 'createdAt', 'updatedAt', 'createdBy',
    'updatedBy', 'button'];


  page: number = 0
  size: number = 7
  nameSearch: string = ''
  parentIdSearch: any = null
  sortBy: string = 'id'
  sortDir: string = 'desc'
  isActive: any = null

  debounceTimerName: any;
  debounceTimerParentId: any;
  dataPageCategory: PageResponse<CategoryAdmin[]> | null = null
  dataCategories: CategoryAdmin[] = [];




  constructor(
    private categoryAdminService: CategoryAdminService,
    private toastService: ToastrService,
    private diaLog: MatDialog
  ) {

  }

  async ngOnInit(): Promise<void> {
    if (this.isActive === null) {
      this.fetchCategory()

    }
    this.fetchCategory();
  }
  onPageChange(newPage: number): void {
    this.page = newPage;  // Cập nhật giá trị page
    this.fetchCategory(); // Gọi lại API với trang mới
  }

  onCreateAtChange() {
    this.fetchCategory();

  }
  onSortDirChange() {
    this.fetchCategory();

  }
  onIsActiveChange(): void {
    this.fetchCategory()
    console.log("Selected isActive value:", this.isActive);
  }

  resetFiter(){
    this.isActive = null;
    this.sortBy ='id'
    this.sortDir ='desc'
    this.nameSearch =''
    this.parentIdSearch=''
    this.fetchCategory()
  }


  async fetchCategory(): Promise<void> {

    const callApis = {
      dataCategories: this.getCategories(this.page, this.size, this.sortBy, this.sortDir, this.nameSearch,
        this.isActive, this.parentIdSearch).pipe(catchError(() => of(null)))
    }

    const response = await firstValueFrom(forkJoin(callApis))
    this.dataPageCategory = response.dataCategories
    console.log(" run  fetchCategory")

    // this.dataCategories = response.dataCategories?.content?.flat() || [];

    // console.log("dataPageCategory : " + this.dataCategories[0].updatedBy)

  }
  onNameChange(value: string): void {
    // Xóa timer cũ nếu có
    if (this.debounceTimerName) {
      clearTimeout(this.debounceTimerName);
    }
    // Đặt timer mới chờ 1s
    this.debounceTimerName = setTimeout(() => {
      this.searchNameCategory(value);
    }, 1000);
  }
  onParentIdChange(value: string): void {
    // Xóa timer cũ nếu có
    if (this.debounceTimerParentId) {
      clearTimeout(this.debounceTimerParentId);
    }
    // Đặt timer mới chờ 1s
    this.debounceTimerParentId = setTimeout(() => {
      this.searchParentIdCategory(value);
    }, 1000);
  }
  searchParentIdCategory(value: string): void {
    this.parentIdSearch = value
    this.fetchCategory()

  }
  searchNameCategory(value: string): void {
    this.nameSearch = value
    this.fetchCategory()
    console.log(" run  searchNameCategory")
    console.log(this.nameSearch)
  }

  getCategories(
    page: number,
    size: number,
    sortBy: string,
    sortDir: string,
    name: string, isActive: boolean,
    parentId: number
  ): Observable<PageResponse<CategoryAdmin[]>> {
    return this.categoryAdminService.getCategoriesAdmin(page, size, sortBy, sortDir, name, isActive, parentId).pipe(
      map((response: ApiResponse<PageResponse<CategoryAdmin[]>>) => response.data || null),
      catchError(() => of(null as any))
    )
  }

  clickNe(id: number) {
    console.log('Selected ID:', id);
  }




  deleteCategory = (id: number): void => {
    // Mở modal xác nhận xóa
    const dialogRef = this.diaLog.open(DialogComponent, {
      data: { message: 'Are you sure you want to delete Category?' }
    });

    // Sau khi modal đóng, kiểm tra kết quả
    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
      if (result === true) {
        // Nếu người dùng xác nhận (result true), gọi API xóa
        this.categoryAdminService.deleteCategory(id).subscribe({
          next: response => {
            this.toastService.success('Success', 'Category Deleted successfully!', { timeOut: 3000 });
            this.fetchCategory();
          },
          error: error => {
            this.toastService.error('Error', 'There was an error deleting the category.', { timeOut: 3000 });
            console.log(error);
          }
        });
      }
    });
  };
  checkedItems: number[] = [];

  toggleCheckbox = (item: any): void => {
    // Đảo trạng thái checkbox của item
    item.checked = !item.checked;

    if (item.checked) {
      if (!this.checkedItems.includes(item.id)) {
        this.checkedItems.push(item.id);
      }
    } else {
      this.checkedItems = this.checkedItems.filter(id => id !== item.id);
    }
    console.log('After toggle:', this.checkedItems);
  }
  deleteCategories = async (): Promise<void> => {
    if (this.checkedItems.length === 0) {
      this.toastService.error(  'No items selected to delete.','Error', { timeOut: 2000 });

      return;
    }
  
    // Mở dialog xác nhận và chờ kết quả
    const result = await firstValueFrom(
      this.diaLog.open(DialogComponent, {
        width: '400px',
        data: { message: 'Are you sure you want to delete Category?' }
      }).afterClosed()
    );
  
    if (result === true) {
      // Xóa các mục theo thứ tự, đợi API xóa từng mục hoàn thành
      for (const id of this.checkedItems) {
        try {
          await firstValueFrom(this.categoryAdminService.deleteCategory(id));
          console.log(`Deleted category with id ${id}`);
          this.toastService.success('Success', 'Category deleted successfully!', { timeOut: 1000 });
        } catch (error) {
          console.error(`Error deleting category with id ${id}`, error);
          this.toastService.error('Error', 'There was an error deleting the category.', { timeOut: 1000 });
        }
      }
    } else {
      console.log('User canceled deletion.');
    }
  
    // Sau khi xóa xong (hoặc hủy), reset mảng và làm mới danh sách
    this.checkedItems = [];
    this.fetchCategory();
  };
  



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

