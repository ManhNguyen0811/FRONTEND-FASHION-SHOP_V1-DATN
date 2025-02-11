import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../models/Product/product';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { PageResponse } from '../../../dto/Response/page-response';
import { ProductListDTO } from '../../../dto/ProductListDTO';
import { ProductVariantDetailDTO } from '../../../models/ProductVariant/product-variant-detailDTO';
import { ColorDTO } from '../../../models/colorDTO';
import { SizeDTO } from '../../../models/sizeDTO';
import { CategoryParentDTO } from '../../../dto/CategoryParentDTO';
import { ImagesDetailProductDTO } from '../../../dto/ImagesDetailProductDTO';
import { VariantsDetailProductDTO } from '../../../dto/VariantsDetailProductDTO';
import { InventoryDTO } from '../../../dto/InventoryDTO';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiBaseUrl}/products`;

  //Lấy danh sách các product
  getProducts(
    languageCode: string,
    categoryId: number,
    isActive: boolean = true,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: 'asc' | 'desc' = 'asc'
  ): Observable<ApiResponse<PageResponse<ProductListDTO[]>>> {
    let params = new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('isActive', isActive.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    // Kiểm tra sortDir có giá trị hợp lệ trước khi set
    if (sortDir) {
      params = params.set('sortDir', sortDir.toString());
    }

    // Kiểm tra minPrice và maxPrice trước khi gọi .toString()
    if (minPrice !== undefined && minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<ApiResponse<PageResponse<ProductListDTO[]>>>(`${this.apiUrl}/${languageCode}`, { params });
  }

  //lấy chi tiết sản phẩm
  getProductDertail(lang: string, productId: number): Observable<ApiResponse<ProductVariantDetailDTO>> {
    return this.http.get<ApiResponse<ProductVariantDetailDTO>>(`${this.apiUrl}/lowest-price-variant/${lang}/${productId}`);
  }

  getSizeProduct(productId: number): Observable<ApiResponse<SizeDTO[]>> {
    return this.http.get<ApiResponse<SizeDTO[]>>(`${this.apiUrl}/size/${productId}`)
  }

  //lấy 1 hình ảnh từ file name
  getImageProduct(fileName: string | undefined): string {
    return `${this.apiUrl}/media/${fileName}`;
  }
  //Lấy danh sách màu của sản phẩm
  getColorNameProduct(productId: number): Observable<ApiResponse<ColorDTO[]>> {
    return this.http.get<ApiResponse<ColorDTO[]>>(`${this.apiUrl}/color/${productId}`);
  }
  //Lấy ảnh màu theo tên màu
  getColorImage(fileName: string | undefined): string {
    return `${environment.apiBaseUrl}/attribute_values/color/${fileName}`;
  }
  // lấy category parent nha 
  getCategoryParent(lang: string, productId: number): Observable<ApiResponse<CategoryParentDTO[]>>{
    return this.http.get<ApiResponse<CategoryParentDTO[]>>(`${this.apiUrl}/${lang}/${productId}/categories/root`)
  }
  getAllImageProduct(productId: number): Observable<ApiResponse<ImagesDetailProductDTO[]>>{
    return this.http.get<ApiResponse<ImagesDetailProductDTO[]>>(`${this.apiUrl}/images/${productId}`)
  }
  getSalePrice(productId: number, colorId: number, sizeId: number): Observable<ApiResponse<VariantsDetailProductDTO>> {
    return this.http.get<ApiResponse<VariantsDetailProductDTO>>(
      `${this.apiUrl}/variants/${productId}?colorId=${colorId}&sizeId=${sizeId}`
    );
  }
  getChangeImageOne(productId: number, colorId: number) : Observable<ApiResponse<ImagesDetailProductDTO[]>>{
    return this.http.get<ApiResponse<ImagesDetailProductDTO[]>>(`${this.apiUrl}/media/${productId}/${colorId}`)
  }

  getQuantityInStock(productId : number, colorId : number) : Observable<ApiResponse<InventoryDTO[]>>{
    return this.http.get<ApiResponse<InventoryDTO[]>>(`${this.apiUrl}/${productId}/inventory?colorId=${colorId}`)
  }
}
