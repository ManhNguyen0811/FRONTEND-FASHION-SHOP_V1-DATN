import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, tap } from 'rxjs';
import { NavigationService } from '../../../services/Navigation/navigation.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../../../services/client/CartService/cart.service';
import { ApiResponse } from '../../../dto/Response/ApiResponse';
import { TotalQty } from '../../../dto/TotalQty';
import { CartDTO } from '../../../dto/CartDTO';
import { ProductServiceService } from '../../../services/client/ProductService/product-service.service';
import { ProductVariantDetailDTO } from '../../../models/ProductVariant/product-variant-detailDTO';
import { TokenService } from '../../../services/token/token.service';
import { CommonModule } from '@angular/common';
import { CartItemDTO } from '../../../dto/CartItemDTO';
import { Currency } from '../../../models/Currency';
import { CurrencyService } from '../../../services/currency/currency-service.service';
import { DetailProductDTO } from '../../../dto/DetailProductDTO';
import { DetailProductService } from '../../../services/client/DetailProductService/detail-product-service.service';
import { response } from 'express';
import { MatDialog } from '@angular/material/dialog';
import { ModalNotifyErrorComponent } from '../Modal-notify/modal-notify-error/modal-notify-error.component';
import { ModelNotifySuccsessComponent } from '../Modal-notify/model-notify-succsess/model-notify-succsess.component';
import { FormsModule } from '@angular/forms';
import { InventoryDTO } from '../../../dto/InventoryDTO';
import { ModalNotifyDeleteComponent } from '../Modal-notify/modal-notify-delete/modal-notify-delete.component';
import { ModalRegisterSuccessComponent } from '../Modal-notify/modal-register-success/modal-register-success.component';
import { CouponLocalizedDTO } from '../../../dto/coupon/CouponClientDTO';
import { CouponService } from '../../../services/client/CouponService/coupon-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, TranslateModule, ModalNotifyDeleteComponent,
    CommonModule, ModalNotifyErrorComponent, ModelNotifySuccsessComponent, FormsModule],
  providers: [CookieService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  currentLang: string = '';
  currentCurrency: string = '';
  cookieValue?: string;
  qtyTotal: number = 0;
  userId?: number;
  sessionId?: string;
  currentCurrencyDetail?: Currency;
  qtyNew?: number
  appliedCoupon: CouponLocalizedDTO | null = null;
  dataDetailsProduct: DetailProductDTO | null = null;
  dataCart: CartDTO | null = null;
  dataProductDetail: ProductVariantDetailDTO[] = [];
  cartItems: CartItemDTO[] = [];

  constructor(
    private navigationService: NavigationService,
    private cookieService: CookieService,
    private cartService: CartService,
    private productService: ProductServiceService,
    private tokenService: TokenService,
    private currencySevice: CurrencyService,
    private detailProductService: DetailProductService,
    private dialog: MatDialog,
    private couponService: CouponService,
    private http : HttpClient


  ) {
    this.sessionId = this.cookieService.get('SESSION_ID') || '';
  }

  async ngOnInit(): Promise<void> {
    this.userId = this.tokenService.getUserId() ?? 0;

     
      this.getQtyCartAuto().subscribe(total => {
        this.qtyTotal = total;
        console.log('Tổng số lượng giỏ hàng:', this.qtyTotal);
      });
 
    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await firstValueFrom(this.navigationService.currentCurrency$);
    this.fetchCurrency()
    await this.fetchApiCart();
    await this.loadProductDetails();
    this.appliedCoupon = this.couponService.getCouponDTO();
    if (this.appliedCoupon) {
      console.log('🎉 Coupon áp dụng:', this.appliedCoupon);
    } else {
      console.log('⚠️ Không có mã giảm giá nào!');
    }

 

    console.log("Danh sách sản phẩm đã tải:", this.qtyTotal);

  }


  getQtyCartAuto(): Observable<number> {
    const userId = this.tokenService.getUserId() ?? 0;
    const sessionId = this.cookieService.get('SESSION_ID') || '';
  
    let params: string[] = [];
    let check = false;
  
    if (userId !== 0) {
      check = true;
      params.push(`userId=${encodeURIComponent(userId)}`);
    }
    if (!check && sessionId.trim()) {
      params.push(`sessionId=${encodeURIComponent(sessionId)}`);
    }
  
    // Nếu cả userId === 0 và sessionId === '' thì không gọi API, trả về 0
    if (!params.length) {
      return of(0);
    }
  
    const queryString = params.length ? `?${params.join('&')}` : '';
  
    return this.http.get<ApiResponse<TotalQty>>(`http://localhost:8080/api/v1/cart/total`).pipe(
      map(response => (response.status === 200 && response.data) ? response.data.totalCart : 0),
      catchError(error => {
        console.error('Lỗi khi lấy tổng số giỏ hàng:', error);
        return of(0);
      })
    );
  }
  
  async fetchApiCart(): Promise<void> {
    if (!this.sessionId) {
      this.sessionId = this.cookieService.get('SESSION_ID') || '';
    }

    console.log('SESSION_ID:', this.sessionId);
    console.log('userId:', this.userId);

    const callApi = {
      qtyTotal: this.getTotalQty(this.userId ?? 0, this.sessionId),
      dataCart: this.getDataCart(this.userId ?? 0, this.sessionId),

    };

    const response = await firstValueFrom(forkJoin(callApi));

    this.qtyTotal = response.qtyTotal?.totalCart ?? 0;
    this.dataCart = response.dataCart;
    this.cartItems = response.dataCart?.cartItems || [];

    console.log("Cart Items:", this.cartItems);
  }

  async loadProductDetails(): Promise<void> {
    if (this.cartItems.length === 0) {
      console.warn("Không có sản phẩm trong giỏ hàng.");
      return;
    }

    const requests = this.cartItems.map((item) =>
      this.getProductDetail(this.currentLang, item.productVariantId)
    );
    const results = await firstValueFrom(forkJoin(requests));
    this.dataProductDetail = results.filter((product): product is ProductVariantDetailDTO => product !== null);

  }

  async fetchProductDetails(lang: string, productId: number): Promise<DetailProductDTO | null> {
    try {
      const response = await firstValueFrom(this.getDetailsProduct(lang, productId));
      console.log("✅ Dữ liệu sản phẩm:", response);
      return response;
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", error);
      return null;
    }
  }

  clearCart() {
    const dialogRef = this.dialog.open(ModalNotifyDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.clearCart(this.userId ?? 0, this.sessionId ?? '').subscribe(async response => {
          this.dialog.open(ModalRegisterSuccessComponent);
          await this.fetchApiCart();

        })
      }
    })
  }
  deleteCart(cardId: number) {
    const dialogRef = this.dialog.open(ModalNotifyDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartService.deleteCart(this.userId ?? 0, this.sessionId ?? '', cardId).subscribe(async response => {
          this.cartService.getQtyCart(this.userId ?? 0, this.sessionId ?? '').subscribe(total => {
            this.cartService.totalCartSubject.next(total);  // Cập nhật tổng số lượng giỏ hàng
          });
          this.dialog.open(ModelNotifySuccsessComponent);
          await this.fetchApiCart();

        })
      }
    })
  }

  updateQtyCart(cardId: number, newQuantity: number, productId: number, colorId: number, sizeId: number) {
    if (newQuantity <= 0) {
      newQuantity = 1;
    }
    this.getStatusQuantityInStock(productId, colorId, sizeId).subscribe(item => {
      if (item?.quantityInStock === undefined || item?.quantityInStock === 0 || item?.quantityInStock < newQuantity) {
        // this.dialog.open(ModalNotifyErrorComponent);
        newQuantity = 1;
      }

      this.cartService.updateQtyCart(this.userId ?? 0, this.sessionId ?? '', cardId, newQuantity)
        .subscribe(async (response) => {
          console.log(`Số lượng mới của sản phẩm ${cardId}: ${newQuantity}`);
          await this.fetchApiCart();
          this.cartService.getQtyCart(this.userId ?? 0, this.sessionId ?? '').subscribe(total => {
            this.cartService.totalCartSubject.next(total);  // Cập nhật tổng số lượng giỏ hàng
          });

          console.log("Giỏ hàng đã được làm mới:", this.cartItems);



        }, (error) => {
          console.error("Lỗi khi cập nhật số lượng:", error);
        });

    });
  }
  getInputValue(event: Event): number {
    const inputElement = event.target as HTMLInputElement;
    return inputElement ? +inputElement.value : 0;
  }

  reduceQty(qtyNew: number, cardId: number, productId: number, colorId: number, sizeId: number) {
    if (qtyNew > 1) {
      this.updateQtyCart(cardId, qtyNew - 1, productId, colorId, sizeId);
    } else {
      console.warn("Số lượng tối thiểu là 1.");
    }
  }


  redoubleQty(qtyNew: number, cardId: number, productId: number, colorId: number, sizeId: number) {
    this.updateQtyCart(cardId, qtyNew + 1, productId, colorId, sizeId);
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
  fetchCurrency() {
    this.getCurrency().subscribe(({ data }) => {
      const index = { en: 0, vi: 1, jp: 2 }[this.currentLang] ?? 0;
      let currency = data?.[index];

      // Kiểm tra currency nếu undefined hoặc thiếu code
      if (!currency || !currency.code) {
        currency = { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rateToBase: 1, isBase: true };
      }

      this.currentCurrencyDetail = currency;
      console.log('💰 Thông tin tiền tệ:', currency);
    });
  }


  getCurrency(): Observable<ApiResponse<Currency[]>> {
    return this.currencySevice.getCurrency().pipe(
      tap(response => console.log("📢 API Currency Response:", response)), // Log dữ liệu API
      map((response: ApiResponse<Currency[]>) => {
        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ API không trả về danh sách tiền tệ hợp lệ!");
          return { ...response, data: [{ id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rateToBase: 1, isBase: true }] };
        }
        return response;
      }),
      catchError(error => {
        console.error('❌ Lỗi khi gọi API tiền tệ:', error);
        return of({
          timestamp: new Date().toISOString(),
          status: 500,
          message: 'Lỗi khi gọi API tiền tệ',
          data: [{ id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rateToBase: 1, isBase: true }],
          errors: ['Không thể lấy dữ liệu tiền tệ']
        } as ApiResponse<Currency[]>);
      })
    );
  }

  getProductDetailByProductVariantId(productVariantId: number): ProductVariantDetailDTO | null {
    return this.dataProductDetail.find(item => item.id === productVariantId) || null;
  }

  getDataCart(userId: number, sessionId: string): Observable<CartDTO | null> {
    return this.cartService.getAllCart(userId, sessionId).pipe(
      map((response: ApiResponse<CartDTO>) => response.data || null),
      catchError((error) => {
        console.error("Lỗi khi gọi API getDataCart:", error);
        return of(null);
      })
    );
  }
  getStatusQuantityInStock(productId: number, colorId: number, sizeId: number): Observable<InventoryDTO | null> {
    return this.productService.getStatusQuantityInStock(productId, colorId, sizeId).pipe(
      map((response: ApiResponse<InventoryDTO>) => response.data || null),
      catchError(() => of(null))
    )
  }
  getCurrencyPrice(price: number, rate: number, symbol: string): string {
    if (!symbol || symbol.trim() === "") {
      symbol = "USD"; // Gán mặc định là USD nếu không hợp lệ
    }

    const convertedPrice = price * rate;

    try {
      const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: symbol }).format(convertedPrice);

      // Nếu ký hiệu là USD thì thay thế "US$" bằng "$"
      return symbol === 'USD' ? formattedPrice.replace('US$', '$') : formattedPrice;
    } catch (error) {
      console.error("❌ Lỗi khi format tiền tệ:", error);
      return `${convertedPrice} ${symbol}`; // Trả về chuỗi đơn giản nếu format thất bại
    }
  }

  getTotalQty(userId: number, sessionId: string): Observable<TotalQty | null> {
    return this.cartService.getTotalQty(userId, sessionId).pipe(
      map((response: ApiResponse<TotalQty>) => response?.data || null),
      catchError((error) => {
        console.error("Lỗi khi gọi API getTotalQty:", error);
        return of(null);
      })
    );
  }

  getProductDetail(lang: string, productVariantId: number): Observable<ProductVariantDetailDTO | null> {
    return this.productService.getProductVariant(lang, productVariantId).pipe(
      map((response: ApiResponse<ProductVariantDetailDTO>) => response.data || null),
      catchError((error) => {
        console.error(`Lỗi khi gọi API getProductDetail với ID ${productVariantId}:`, error);
        return of(null);
      })
    );
  }
  // coupon
  getDiscountAmount(): number {
    if (!this.appliedCoupon || !this.dataCart) return 0;

    if (this.appliedCoupon.discountType === 'PERCENTAGE') {
      return (this.dataCart.totalPrice ?? 0) * (this.appliedCoupon.discountValue / 100);
    }

    return this.appliedCoupon.discountValue ?? 0;
  }

  getTotalAfterDiscount(): number {
    return Math.max((this.dataCart?.totalPrice ?? 0) - this.getDiscountAmount(), 0); // Đảm bảo không bị âm
  }

}
