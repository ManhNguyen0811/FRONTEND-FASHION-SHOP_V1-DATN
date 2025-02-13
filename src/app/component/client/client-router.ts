import {Route, RouterModule, Routes} from "@angular/router";
import { ClientComponent } from "./client.component";
import { HomeComponent } from "./home/home.component";
import { ProductComponent } from "./product/product.component";
import { CartComponent } from "./cart/cart.component";
import { LoginComponent } from "./login/login.component";
import { SigninComponent } from "./signin/signin.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ProfileComponent } from "./profile/profile.component";
import { OrderHistoryComponent } from "./profile/order-history/order-history.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { OrderDetailComponent } from "./profile/order-detail/order-detail.component";
import { EditAddressComponent } from "./profile/edit-address/edit-address.component";
import { DetailProductComponent } from "./detail-product/detail-product.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { WishlistComponent } from "./wishlist/wishlist.component";
import { InsertReviewComponent} from './insert-review/insert-review.component';
import { CheckSizeComponent} from './check-size/check-size.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponComponent} from './coupon/coupon.component';
import {ShippingComponent} from './checkout/shipping/shipping.component';
import {PaymentComponent} from './checkout/payment/payment.component';
import {ReviewOrderComponent} from './checkout/review-order/review-order.component';
import {LanguageCurrencyResolver} from '../../resolvers/language-currency.resolver';
import {ImageDetailComponent} from './image-detail/image-detail.component';
import {routes} from '../../app.routes';
import {NgModule} from '@angular/core';

export const clientRouter: Routes =[
    {

        path: ':currency/:lang', // Thêm tham số tiền tệ, ngôn ngữ
        component: ClientComponent,
        resolve:{langCurrency: LanguageCurrencyResolver },
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'product',
                component: ProductComponent
            },
            {
                path: 'detail_product/:productId/:colorId/:sizeId',
                component: DetailProductComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
          {
            path: 'checkout',
            component: CheckoutComponent,
            children: [
              { path: 'shipping', component: ShippingComponent },
              { path: 'payment', component: PaymentComponent },
              { path: 'review', component: ReviewOrderComponent },

              { path: '', redirectTo: 'shipping', pathMatch: 'full' },
            ],
          },

          { path: 'coupon',
            component: CouponComponent
          },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'signin',
                component: SigninComponent
            },
            {
                path: 'forgot_password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reviews',
                component: ReviewsComponent
            },
            {
                path: 'wishlist',
                component: WishlistComponent
            },
            {
                path: 'profile',
                component: ProfileComponent,
                children: [
                    { path: 'order_history', component: OrderHistoryComponent },
                    { path: 'edit_profile', component: EditProfileComponent },
                    { path: 'order_history/order_detail', component: OrderDetailComponent  },
                    { path: 'edit_address', component: EditAddressComponent },

                ]
            },
            {
                path: 'review/new',
                component: InsertReviewComponent
            },
            {
              path: 'size',
              component: CheckSizeComponent
            },
            {
              path: 'imageDetail/:mediaId',
              component: ImageDetailComponent
            },
        ]
    },
    { path: '', redirectTo: 'vn/vi', pathMatch: 'full' } // Mặc định là 'vi'
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
