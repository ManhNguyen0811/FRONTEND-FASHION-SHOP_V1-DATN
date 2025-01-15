import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeaderAdminComponent } from '../../header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';

interface Category {
  id: number,
  name: string,
  subCategories: Category[]
}

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [HeaderAdminComponent, RouterLink, CommonModule, FormsModule,ButtonComponent],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent {
  id!: number;

  listCategory: Category[] = []
  selectIdChild: number | undefined
  selectIdSubChild: number | undefined

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    console.log('Received ID:', this.id);

    this.listCategory = this.categories

  }

  categories: Category[] = [
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

  getListCategoryChild(categoriesIdChild: number | undefined): Category[] {

    if (categoriesIdChild !== undefined) {
      const categoriesIdChildNumber = Number(categoriesIdChild);
      const selectedCategory = this.listCategory.find(category => category.id === categoriesIdChildNumber);
      
      if (selectedCategory) {
        return selectedCategory.subCategories;
      } else {
        console.log('Không tìm thấy category với id:', categoriesIdChild);
        return [];
      }
    } else {
      // console.log('categoriesIdChild không hợp lệ');
      return [];
    }
  }

  getListCategorySubChild(categoriesIdChild: number | undefined): Category[] {

    if (categoriesIdChild !== undefined) {
      const categoriesIdSubChildNumber = Number(categoriesIdChild);
      const selectedCategory = this.getListCategoryChild(this.selectIdChild).find(category => category.id === categoriesIdSubChildNumber);
      
      if (selectedCategory) {
        return selectedCategory.subCategories;
      } else {
        console.log('Không tìm thấy category với id:', categoriesIdChild);
        return [];
      }
    } else {
      // console.log('categoriesIdChild không hợp lệ');
      return [];
    }
  }



  clickEvent(){
    console.log("aaaaa")
  }







}