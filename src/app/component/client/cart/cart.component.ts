import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {BehaviorSubject, catchError, firstValueFrom, forkJoin, map, Observable, of, tap} from 'rxjs';
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
import {CouponLocalizedDTO} from '../../../dto/coupon/CouponClientDTO';
import {CouponService} from '../../../services/client/CouponService/coupon-service.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule],
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
    private couponService: CouponService,


  ) {
    this.sessionId = this.cookieService.get('SESSION_ID') || '';
  }

  async ngOnInit(): Promise<void> {
    this.currentLang = await firstValueFrom(this.navigationService.currentLang$);
    this.currentCurrency = await firstValueFrom(this.navigationService.currentCurrency$);
    this.userId = this.tokenService.getUserId() ?? 0;
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




  /** 🔹 Lưu mã giảm giá đã chọn */

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

    // Lọc bỏ giá trị null
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
