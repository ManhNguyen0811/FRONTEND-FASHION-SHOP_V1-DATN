import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavigationService } from '../../../services/Navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { NavBottomComponent } from '../nav-bottom/nav-bottom.component';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, take, tap } from 'rxjs';
import { ProductServiceService } from '../../../services/client/ProductService/product-service.service';
import { DetailProductService } from '../../../services/client/DetailProductService/detail-product-service.service';
import { ImagesDetailProductDTO } from '../../../dto/ImagesDetailProductDTO';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { SizeDTO } from '../../../models/sizeDTO';
import { VariantsDetailProductDTO } from '../../../dto/VariantsDetailProductDTO';
import { Location } from '@angular/common';
import { ColorDTO } from '../../../models/colorDTO';
import { CategoryParentDTO } from '../../../dto/CategoryParentDTO';
import { response } from 'express';
import { DetailProductDTO } from '../../../dto/DetailProductDTO';
import { InventoryDTO } from '../../../dto/InventoryDTO';
import { ReviewServiceService } from '../../../services/client/ReviewService/review-service.service';
import { ReviewTotalDTO } from '../../../dto/ReviewTotalDTO';
import { ReviewAverageDTO } from '../../../dto/ReviewAverageDTO';
import { Currency } from '../../../models/Currency';
import { CurrencyService } from '../../../services/currency/currency-service.service';
import { ReviewDetailProductDTO } from '../../../dto/ReviewDetailProductDTO';
import { PageResponse } from '../../../dto/Response/page-response';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslateModule, NavBottomComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss'
})
export class DetailProductComponent implements OnInit {
  productId?: number;
  colorId?: number;
  sizeId?: number;
  selectedSizeId!: number;
  selectedColorId!: number;
  currentLang: string = '';
  currentCurrency: string = '';
  currentCurrencyDetail?: Currency;


  dataImagesProduct: ImagesDetailProductDTO[] = [];
  dataVideoProduct: ImagesDetailProductDTO[] = []
  dataReviewDetailProduct: ReviewDetailProductDTO[] = []
  dataSizes: SizeDTO[] = [];
  dataColors: ColorDTO[] = [];
  dataCategoryParent: CategoryParentDTO[] = [];
  dataDetailsProduct: DetailProductDTO | null = null;
  dataQuantityInStock: InventoryDTO[] = []
  reviewAverage: number = 0
  reviewTotal: number = 0
  salePrice: number = 0;
  quantityInStock?: InventoryDTO | null = null;

  page: number = 0
  size: number =3
  sortBy: string = 'id'
  sortDir: string = 'desc'

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private routerActi: ActivatedRoute,
    private productService: ProductServiceService,
    private detailProductService: DetailProductService,
    private location: Location,
    private reviewService: ReviewServiceService,
    private currencySevice: CurrencyService,
    private cdr: ChangeDetectorRef,


  ) { }

  async ngOnInit(): Promise<void> {
    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await firstValueFrom(this.navigationService.currentCurrency$);
    this.getIdsFromProductRouter();
    this.fetchCurrency();

    this.loadDetailProduct(this.productId ?? 0).then(() => {
      this.selectedSizeId = this.sizeId ?? 0; // Đánh dấu size được chọn
      this.selectedColorId = this.colorId ?? 0; // Đánh dấu size được chọn
    });
    this.updateUrl(this.productId ?? 0, this.colorId ?? 0, this.sizeId ?? 0);
  }



  async loadDetailProduct(productId: number): Promise<void> {
    if (!productId) return;

    const response = await firstValueFrom(
      forkJoin({
        allImagesProduct: this.getAllImagesProduct(productId).pipe(catchError(() => of([]))),
        dataSizes: this.getSizeProduct(productId).pipe(catchError(() => of([]))),
        salePrice: this.getSalePrice(this.productId ?? 0, this.colorId ?? 0, this.sizeId ?? 0).pipe(catchError(() => of(0))),
        dataColors: this.getColorNameProduct(productId).pipe(catchError(() => of([]))),
        dataCategoryParent: this.getCategoryParent(this.currentLang, productId).pipe(catchError(() => of([]))),
        dataDetailsProduct: this.getDetailsProduct(this.currentLang, productId).pipe(catchError(() => of(null))),
        dataQuantityInStock: this.getQuantityInStock(productId, this.colorId ?? 0).pipe(catchError(() => of([]))),
        reviewTotal: this.getReviewTotal(productId).pipe(catchError(() => of(0))),
        reviewAverage: this.getReviewAverage(productId).pipe(catchError(() => of(0))),
        quantityInStock: this.getStatusQuantityInStock(productId, this.colorId ?? 0, this.sizeId ?? 0).pipe(catchError(() => of(null))),
        dataVideoProduct: this.getVideosProduct(productId).pipe(catchError(() => of([]))),
        dataReviewDetailProduct : this.getReviewDetailProduct(productId,this.page,this.size,this.sortBy,this.sortDir).pipe(catchError(() => of([])))
      })
    );

    this.dataImagesProduct = response.allImagesProduct;
    this.dataSizes = response.dataSizes;
    this.salePrice = response.salePrice;
    this.dataColors = response.dataColors;
    this.dataCategoryParent = response.dataCategoryParent;
    this.reviewAverage = response.reviewAverage;
    this.reviewTotal = response.reviewTotal;
    this.dataDetailsProduct = response.dataDetailsProduct
    this.dataQuantityInStock = response.dataQuantityInStock
    this.quantityInStock = response.quantityInStock
    this.dataVideoProduct = response.dataVideoProduct
    this.dataReviewDetailProduct = response.dataReviewDetailProduct
    console.log("dataQuantityInStock : " + this.dataReviewDetailProduct[0].comment)
  }



  getIdsFromProductRouter(): void {
    this.routerActi.params.pipe(take(1)).subscribe(params => {
      this.productId = Number(params['productId']) || 0;
      this.colorId = Number(params['colorId']) || 0;
      this.sizeId = Number(params['sizeId']) || 0;
    });
  }


  getDetailsProduct(lang: string, productId: number): Observable<DetailProductDTO | null> {
    return this.detailProductService.getDetailProduct(lang, productId).pipe(
      map((response: ApiResponse<DetailProductDTO>) => response?.data ?? null),
      catchError((error) => {
        console.error("❌ Lỗi khi gọi API getDetailsProduct:", error);
        return of(null);
      })
    );

  }
  getQuantityInStock(productId: number, colorId: number): Observable<InventoryDTO[]> {
    return this.productService.getQuantityInStock(productId, colorId).pipe(
      map((response: ApiResponse<InventoryDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
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

  getAllImagesProduct(productId: number): Observable<ImagesDetailProductDTO[]> {
    return this.productService.getAllImageProduct(productId).pipe(
      map((response: ApiResponse<ImagesDetailProductDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
  }
  getVideosProduct(productId: number): Observable<ImagesDetailProductDTO[]> {
    return this.productService.getVideosProduct(productId).pipe(
      map((response: ApiResponse<ImagesDetailProductDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
  }
  getCurrencyPrice(price: number, rate: number, symbol: string): string {
    const convertedPrice = price * rate;
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: symbol }).format(convertedPrice);

    // Nếu ký hiệu là USD thì thay thế "US$" bằng "$"
    return symbol === 'USD' ? formattedPrice.replace('US$', '$') : formattedPrice;
  }



  getImageProduct(fileName: string | undefined): string {
    return this.productService.getImageProduct(fileName);
  }
  getImageColor(fileName: string | undefined): string {
    return this.productService.getColorImage(fileName);
  }

  getSizeProduct(productId: number): Observable<SizeDTO[]> {
    return this.productService.getSizeProduct(productId).pipe(
      map((response: ApiResponse<SizeDTO[]>) => response.data || []),
      catchError(() => of([]))
    );
  }

  getColorNameProduct(productId: number): Observable<ColorDTO[]> {
    return this.productService.getColorNameProduct(productId).pipe(
      map(
        (response: ApiResponse<ColorDTO[]>) => response.data || []
      ), // Chỉ lấy `data`
      catchError(() => of([])) // Trả về mảng rỗng nếu lỗi
    );
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

  // lấy all review 
  getReviewDetailProduct(
    productId: number,
    page: number,
    size: number,
    sortBy: string,
    sortDir: string 
  ): Observable<ReviewDetailProductDTO[]> {
    return this.reviewService.getReviewDetailProduct(productId, page, size, sortBy, sortDir).pipe(
      map((response: ApiResponse<PageResponse<ReviewDetailProductDTO[]>>) => 
        response.data?.content ? response.data.content.flat() : []
      ),
      catchError(() => of([]))
    );
  }
  


  // lấy giá sale 
  getSalePrice(productId: number, colorId: number, sizeId: number): Observable<number> {
    return this.productService.getSalePrice(productId, colorId, sizeId).pipe(
      map((response: ApiResponse<VariantsDetailProductDTO>) => response.data?.salePrice ?? 0),
      catchError(() => of(0))
    );
  }
  //chọn để lấy giá trị màu và sizesize

  selectSize(size: SizeDTO): void {
    this.selectedSizeId = size.id;
    this.sizeId = size.id;

    this.getSalePrice(this.productId ?? 0, this.colorId ?? 0, size.id).subscribe(price => {
      this.salePrice = price;
      this.cdr.detectChanges();

    });
    this.getStatusQuantityInStock(this.productId ?? 0, this.colorId ?? 0, size.id).subscribe(qty => {
      console.log(qty?.quantityInStock)
      this.quantityInStock = qty; // Nếu null, gán giá trị mặc định là 0
      this.cdr.detectChanges();
    });


    this.updateUrl(this.productId ?? 0, this.colorId ?? 0, size.id);
  }

  selectColor(color: ColorDTO): void {
    this.selectedColorId = color.id;
    this.colorId = color.id;

    this.getSalePrice(this.productId ?? 0, color.id, this.sizeId ?? 0).subscribe(price => {
      this.salePrice = price;
      this.cdr.detectChanges();
    });

    this.getQuantityInStock(this.productId ?? 0, color.id).subscribe(colorList => {
      this.dataQuantityInStock = colorList
    })
    this.getStatusQuantityInStock(this.productId ?? 0, color.id, this.sizeId ?? 0).subscribe(qty => {
      this.quantityInStock = qty;
      this.cdr.detectChanges(); // Cập nhật giao diện ngay khi có dữ liệu mới
    });

    this.changeImageOne(this.productId ?? 0, color.id).subscribe(images => {
      if (images) {
        this.dataImagesProduct[0].mediaUrl = images[0].mediaUrl; // Cập nhật danh sách ảnh
        this.cdr.detectChanges();
      }
    });

    this.updateUrl(this.productId ?? 0, color.id, this.sizeId ?? 0);

  }
  //---------



  isSizeOutOfStock(size: any): boolean {
    const variant = this.dataQuantityInStock.find(
      v => v.colorName === this.selectedColorName && v.sizeName === size.valueName
    );
    return variant ? variant.quantityInStock === 0 : false;
  }

  getReviewTotal(productId: number): Observable<number> {
    return this.reviewService.getReviewTotal(productId)
      .pipe(
        map(
          (response: ApiResponse<ReviewTotalDTO>) => response.data.totalReviews || 0),
        catchError(() => of(0))
      )

  }

  getReviewAverage(productId: number): Observable<number> {
    return this.reviewService.getReviewAverage(productId)
      .pipe(
        map((response: ApiResponse<ReviewAverageDTO>) => response.data.avgRating || 0),
        catchError(() => of(0))
      )
  }
  getStatusQuantityInStock(productId: number, colorId: number, sizeId: number): Observable<InventoryDTO | null> {
    return this.productService.getStatusQuantityInStock(productId, colorId, sizeId).pipe(
      map((response: ApiResponse<InventoryDTO>) => response.data || null),
      catchError(() => of(null))
    )
  }

  // lấy tên khi chọn 
  get selectedSizeName(): string {
    const selectedSize = this.dataSizes.find(size => size.id === this.selectedSizeId);
    if (!selectedSize || this.isSizeOutOfStock(selectedSize)) {
      return 'Hết hàng';
    }
    return selectedSize.valueName;
  }

  get selectedColorName(): string {
    return this.dataColors.find(color => color.id === this.selectedColorId)?.valueName || 'Không xác định';
  }
  // ----------------

  // đổi url khi đổi màu và size 
  updateUrl(productId: number, colorId: number, sizeId: number): void {
    const newUrl = `/client/${this.currentCurrency}/${this.currentLang}/detail_product/${productId}/${colorId}/${sizeId}`;
    this.location.replaceState(newUrl);
  }

  //lấy cate cha 
  getCategoryParent(lang: string, productId: number): Observable<CategoryParentDTO[]> {
    return this.productService.getCategoryParent(lang, productId)
      .pipe(
        map((response: ApiResponse<CategoryParentDTO[]>) => response.data || []),
        catchError(() => of([]))
      )
  }

  isDetailsOpen: boolean = false;
  isCareOpen: boolean = false;

  toggleAccordion(section: string): void {
    if (section === 'details') {
      this.isDetailsOpen = !this.isDetailsOpen;
    } else if (section === 'care') {
      this.isCareOpen = !this.isCareOpen;
    }
  }

  rating: number = 5;
  reviewCount: number = 999;
 

  getFullStars(rating: number): Array<number> {
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): Array<number> {
    return Array(5 - Math.floor(rating)).fill(0);
  }
}
