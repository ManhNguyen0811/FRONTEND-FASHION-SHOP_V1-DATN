import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavBottomComponent } from '../nav-bottom/nav-bottom.component';
import { FooterComponent } from '../footer/footer.component';
import { ImageDetailService } from '../../../services/client/ImageDetailService/image-detail.service';
import { catchError, defaultIfEmpty, firstValueFrom, forkJoin, map, Observable, of, take } from 'rxjs';
import { NavigationService } from '../../../services/Navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { MediaInfoDTO } from '../../../dto/MediaInfoDTO';
import { response } from 'express';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { DetailMediaDTO } from '../../../dto/DetailMediaDTO';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { Currency } from '../../../models/Currency';
import { CurrencyService } from '../../../services/currency/currency-service.service';
import { DetailProductService } from '../../../services/client/DetailProductService/detail-product-service.service';
import { DetailProductDTO } from '../../../dto/DetailProductDTO';
import { TranslateModule } from '@ngx-translate/core';
import { ProductServiceService } from '../../../services/client/ProductService/product-service.service';
import { CategoryParentDTO } from '../../../dto/CategoryParentDTO';
 
import { ImagesDetailProductDTO } from '../../../dto/ImagesDetailProductDTO';
import { CateProductDTO } from '../../../dto/CateProductDTO';

export interface ImagesOfDetailProduct {
  productId: number,
  imageDetailProduct: ImagesDetailProductDTO[]
}

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    NavBottomComponent,
    FooterComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './image-detail.component.html',
  styleUrl: './image-detail.component.scss'
})




export class ImageDetailComponent implements OnInit {
  currentLang: string = '';
  currentCurrency: string = '';
  mediaId: number = 0;

  dataMediaInfo: MediaInfoDTO | null = null;
  dataDetailMedia: DetailMediaDTO[] | null = null
  currentCurrencyDetail?: Currency;
  dataProduct: DetailProductDTO[] | null = null
  dataDetailsProduct: DetailProductDTO | null = null;
  dataCategoryParent: CateProductDTO[] = [];
  dataImagesOfDetailProduct: ImagesOfDetailProduct[] | null = null




  constructor(
    private imageDetailService: ImageDetailService,
    private navigationService: NavigationService,
    private activeRoute: ActivatedRoute,
    private currencySevice: CurrencyService,
    private detailProductService: DetailProductService,
    private productService: ProductServiceService,




  ) { }


  async ngOnInit(): Promise<void> {
    this.currentLang = await firstValueFrom(
      this.navigationService.currentLang$.pipe(defaultIfEmpty('en'))
    );
    this.currentCurrency = await firstValueFrom(
      this.navigationService.currentCurrency$.pipe(defaultIfEmpty('USD'))
    );
    await this.getMediaIdFromRouter();
    this.fetchImageDetail(this.mediaId)
    this.fetchCurrency()



  }


  getMediaIdFromRouter(): void {
    this.activeRoute.params.pipe(take(1)).subscribe(params => {
      this.mediaId = Number(params['mediaId'])
    })
  }

  async fetchImageDetail(mediaId: number): Promise<void> {
    if (!mediaId) {
      console.log('mediaId error');
      return;
    }

    const callApis = {
      dataMediaInfo: this.getMediaInfo(mediaId).pipe(catchError(() => of(null))),
      dataDetailMedia: this.getDetailMedia(mediaId).pipe(catchError(() => of([]))),
    };

    const response = await firstValueFrom(forkJoin(callApis));
    this.dataMediaInfo = response.dataMediaInfo;
    this.dataDetailMedia = response.dataDetailMedia ?? []; // Đảm bảo không bị null

    // Kiểm tra trước khi gọi forEach
    if (this.dataDetailMedia?.length > 0) {
      this.dataDetailMedia.forEach((item) => {
        if (item.productId) {
          // Gọi API để lấy thông tin sản phẩm
          this.getDetailsProduct(this.currentLang, item.productId).subscribe(data => {
            if (data) {
              if (!this.dataProduct) {
                this.dataProduct = [];
              }
              this.dataProduct.push(data);
            }
          });

          // Gọi API để lấy danh mục cha, chỉ duyệt qua từng item một lần
          this.getCategoryParent(this.currentLang, item.productId).subscribe(data => {
            if (data) {
              if (!this.dataCategoryParent) {
                this.dataCategoryParent = [];
              }
              this.dataCategoryParent.push({
                productId: item.productId,
                cateParent: data
              });
            }
          });
        }

        this.changeImageOne(item.productId, item.colorId).subscribe(data => {
          console.log("color: " + item.colorId + " ===== " + "product : " + item.productId)
          if (data) {
            if (!this.dataImagesOfDetailProduct) {
              this.dataImagesOfDetailProduct = []
            }
            this.dataImagesOfDetailProduct.push({
              productId: item.productId,
              imageDetailProduct: data
            })
            console.log(this.dataImagesOfDetailProduct); // Kiểm tra dữ liệu


          }
        })

      });
    }

  }


  getMediaInfo(mediaId: number): Observable<MediaInfoDTO | null> {
    return this.imageDetailService.getMediaInfo(mediaId).pipe(
      map((response: ApiResponse<MediaInfoDTO>) => response?.data || null),
      catchError((error) => {
        console.error('Lỗi khi gọi API getMediaInfo : ', error);
        return of(null);
      })
    );
  }

  getDetailMedia(mediaId: number): Observable<DetailMediaDTO[] | null> {
    return this.imageDetailService.getDetailMedia(mediaId).pipe(
      map((response: ApiResponse<DetailMediaDTO[]>) => response.data),
      catchError((error) => {
        console.error('Lỗi khi gọi API getDetailMedia : ', error);
        return of(null);
      })
    )
  }

  fetchCurrency() {
    this.getCurrency().subscribe(({ data }) => {
      const index = { en: 0, vi: 1, jp: 2 }[this.currentLang] ?? 0;
      const currency = data?.[index] || { code: '', name: '', symbol: '', exchangeRate: 0 };
      this.currentCurrencyDetail = currency

      console.log('Thông tin tiền tệ:', currency);
    });


  }

  getCurrency(): Observable<ApiResponse<Currency[]>> {
    return this.currencySevice.getCurrency().pipe(
      map((response: ApiResponse<Currency[]>) => {
        // console.log('Dữ liệu tiền tệ lấy thành công:', response );
        return response;
      }),

      catchError(error => {
        console.error('Lỗi khi lấy danh sách tiền tệ:', error);
        return of({
          timestamp: new Date().toISOString(),
          status: 500,
          message: 'Lỗi khi gọi API tiền tệ',
          data: [],
          errors: ['Không thể lấy dữ liệu tiền tệ']
        } as ApiResponse<Currency[]>); // Trả về một ApiResponse<Currency[]> hợp lệ
      })
    );
  }

  getCurrencyPrice(price: number, rate: number, symbol: string): string {
    if (!symbol || typeof symbol !== 'string') {
      console.error('Invalid currency code:', symbol);
      return `${price * rate}${symbol ?? ''}`; // Trả về giá trị thô nếu symbol không hợp lệ
    }

    try {
      const convertedPrice = price * rate;
      const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: symbol
      }).format(convertedPrice);

      if (symbol === 'USD') {
        return `$${formattedPrice.replace('US$', '').trim()}`; // Hiển thị dấu `$` trước số tiền
      }

      return formattedPrice;
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${price * rate} ${symbol}`; // Trả về giá trị thô nếu có lỗi
    }
  }
  getDetailsProduct(lang: string, productId: number): Observable<DetailProductDTO | null> {
    return this.detailProductService.getDetailProduct(lang, productId).pipe(
      map((response: ApiResponse<DetailProductDTO>) => response?.data ?? null),
      catchError((error) => {
        console.error("❌ Lỗi khi gọi API getDetailsProduct:", error);
        return of(null); // Trả về null nếu có lỗi
      })
    );
  }

  getNameProduct(productId: number): string {
    const product = this.dataProduct?.find(product => product.id === productId);
    return product ? product.name : 'Không tìm thấy sản phẩm';
  }
  
  getMediaUrl(productId: number): string {
    const product = this.dataImagesOfDetailProduct?.find(product => product.productId === productId);
    return product ? product.imageDetailProduct[0].mediaUrl : 'Không tìm thấy sản phẩm';
  }

  getPromotionProduct(productId: number): string {
    const product = this.dataProduct?.find(product => product.id === productId);

    if (product && product.promotion?.endDate) {
      const endDate = new Date(product.promotion.endDate);
      return endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // Định dạng dd/MM
    }

    return 'Không tìm thấy sản phẩm';
  }




  getCategoryParent(lang: string, productId: number): Observable<CategoryParentDTO[]> {
    return this.productService.getCategoryParent(lang, productId)
      .pipe(
        map((response: ApiResponse<CategoryParentDTO[]>) => response.data || []),
        catchError(() => of([]))
      )
  }

  getStringCateProduct(lang: string, productId: number): string {
    const cate = this.dataCategoryParent.find(item => item.productId === productId);

    if (!cate || !cate.cateParent || cate.cateParent.length === 0) {
      return 'Không tìm thấy cate parent '; // Trả về chuỗi rỗng nếu không tìm thấy danh mục
    }

    if (cate.cateParent.length === 1) {
      return cate.cateParent[0].name + ' ';
    }

    return 'Unisex';
  }

  changeImageOne(productId: number, colorId: number): Observable<ImagesDetailProductDTO[] | null> {
    return this.productService.getChangeImageOne(productId, colorId).pipe(
      map((response: ApiResponse<ImagesDetailProductDTO[]>) => {
        return response.data || null;
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }


}
