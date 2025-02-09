import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { NavigationService} from '../../../services/Navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import {ProductServiceService} from '../../../services/client/ProductService/product-service.service';
import {ApiResponse} from '../../../dto/Response/ApiResponse';
import {PageResponse} from '../../../dto/Response/page-response';
import {ProductListDTO} from '../../../dto/ProductListDTO';
import {catchError, firstValueFrom, forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {ProductVariantDetailDTO} from '../../../models/ProductVariant/product-variant-detailDTO';
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from '@angular/common';
import {ColorDTO} from '../../../models/colorDTO';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgForOf, AsyncPipe, NgIf, CurrencyPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  currentLang: string = '';
  currentCurrency: string = '';
  products: (ProductListDTO & {
    detail?: ProductVariantDetailDTO | null,
    colors?: ColorDTO[]
  })[] = [];

  pageNo: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  first: boolean = false;
  last: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private navigationService: NavigationService
  ) {}

  async ngOnInit(): Promise<void> {
    // Lấy ngôn ngữ hiện tại trước khi gọi API
    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);

    // Lắng nghe queryParams để cập nhật sản phẩm theo category, paging, v.v.
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'] ? parseInt(params['categoryId'], 10) : 1;
      const isActive = params['isActive'] === 'true';
      const page = params['page'] ? parseInt(params['page'], 10) : 0;
      const size = params['size'] ? parseInt(params['size'], 10) : 10;
      const sortBy = params['sortBy'] || 'id';
      const sortDir: 'asc' | 'desc' = params['sortDir'] === 'desc' ? 'desc' : 'asc';

      this.fetchProducts(categoryId, isActive, page, size, sortBy, sortDir);
    });
  }

  fetchProducts(
    categoryId: number,
    isActive: boolean,
    page: number,
    size: number,
    sortBy: string,
    sortDir: 'asc' | 'desc'
  ): void {
    this.productService.getProducts(this.currentLang, categoryId, isActive, undefined, undefined, undefined, page, size, sortBy, sortDir)
      .subscribe(
        (response: ApiResponse<PageResponse<ProductListDTO[]>>) => {
          if (response.data && Array.isArray(response.data.content)) {
            const productList = response.data.content.flat();

            // Gọi API lấy chi tiết sản phẩm & màu song song
            const productRequests = productList.map(product =>
              forkJoin({
                detail: this.getProductDetail(product.id).pipe(catchError(() => of(null))),
                colors: this.getColorNameProduct(product.id).pipe(catchError(() => of([])))
              }).pipe(
                map(({ detail, colors }) => ({ ...product, detail, colors }))
              )
            );

            // Chờ tất cả API hoàn thành và cập nhật danh sách sản phẩm
            forkJoin(productRequests).subscribe(updatedProducts => {
              this.products = updatedProducts;
            });

            this.pageNo = response.data.pageNo;
            this.pageSize = response.data.pageSize;
            this.totalPages = response.data.totalPages;
            this.totalElements = response.data.totalElements;
            this.first = response.data.first;
            this.last = response.data.last;
          }
          this.errorMessage = '';  // Xóa lỗi nếu có trước đó
        },
        (error) => {
          console.error('Error fetching products:', error);
          this.errorMessage = error.message || 'Đã xảy ra lỗi khi tải danh sách sản phẩm.';
        }
      );
  }
  //lấy dữ liệu chi tiết của sản phẩm
  getProductDetail(productId: number): Observable<ProductVariantDetailDTO | null> {
    return this.productService.getProductDertail(this.currentLang, productId).pipe(
      map((response: ApiResponse<ProductVariantDetailDTO>) => response.data || null),
      catchError(() => of(null)) // Trả về null nếu có lỗi
    );
  }




// Lấy đường dẫn hình ảnh từ tên file
  getImageProduct(fileName: string | undefined): string {
    console.log(this.productService.getImageProduct(fileName))
    return this.productService.getImageProduct(fileName);
  }

  //Lấy danh sách tên màu theo productId
  getColorNameProduct(productId: number): Observable<ColorDTO[]> {
    return this.productService.getColorNameProduct(productId).pipe(
      map((response: ApiResponse<ColorDTO[]>) => response.data || []), // Chỉ lấy `data`
      catchError(() => of([])) // Trả về mảng rỗng nếu lỗi
    );
  }

  // Lấy ảnh màu theo tên màu
  getColorImage(fileName: string | undefined): string {
    return fileName ? `${environment.apiBaseUrl}/attribute_values/color/${fileName}` : 'default-color.jpg';
  }


}
