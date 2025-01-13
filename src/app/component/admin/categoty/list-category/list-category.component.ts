import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { TableComponent } from '../../table/table.component';

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
  imports: [HeaderAdminComponent, TableComponent],
  templateUrl: './list-category.component.html',
  styleUrl: './list-category.component.scss'
})


export class ListCategoryComponent implements OnInit {
  headers: string[] = ['id', 'name', 'imageUrl', 'isActive', 'parentsID', 'parentsName', 'createdAt', 'updatedAt', 'button'];

  checkedItems: any[] = [];  // Danh sách các mục đã chọn, đã được khởi tạo



  data: TableDataModel[] = [

    {
      id: 1,
      name: 'Product A',
      imageUrl: 'https://im.uniqlo.com/global-cms/spa/res5531725dc496187c0b233c84e865bdd8fr.png',
      isActive: true,
      parentsID: 101,
      parentsName: 'Category A',
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-10T12:00:00Z'
    },
    {
      id: 2,
      name: 'Product B',
      imageUrl: 'https://im.uniqlo.com/global-cms/spa/res5531725dc496187c0b233c84e865bdd8fr.png',
      isActive: false,
      parentsID: 102,
      parentsName: 'Category B',
      createdAt: '2024-01-05T10:30:00Z',
      updatedAt: '2024-01-15T14:00:00Z'
    },
    {
      id: 200,
      name: 'Product C',
      imageUrl: 'https://im.uniqlo.com/global-cms/spa/res5531725dc496187c0b233c84e865bdd8fr.png',
      isActive: true,
      parentsID: 103,
      parentsName: 'Category C',
      createdAt: '2024-02-01T08:00:00Z',
      updatedAt: '2024-02-10T09:30:00Z'
    }
  ];



  ngOnInit(): void {
  }

  clickNe(id :number ) {
    console.log('Selected ID:', id);
  }
  
  

  toggleCheckbox(item: any) {
    if (!Array.isArray(this.checkedItems)) {
      this.checkedItems = [];  // Khởi tạo checkedItems nếu chưa phải là mảng
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
  
 
  

}

