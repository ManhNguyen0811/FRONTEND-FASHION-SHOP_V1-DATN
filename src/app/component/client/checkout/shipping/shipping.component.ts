import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CheckoutService} from '../../../../services/checkout/checkout.service';
import {CommonModule, NgClass, NgIf} from "@angular/common";
import {AddressDTO} from '../../../../dto/address/AddressDTO';
import {NavigationService} from '../../../../services/Navigation/navigation.service';
import {HttpClient} from '@angular/common/http';
import {AddressServiceService} from '../../../../services/client/AddressService/address-service.service';
import {TokenService} from '../../../../services/token/token.service';
import {LocationServiceService} from '../../../../services/client/LocationService/location-service.service';
import {ApiResponse} from '../../../../dto/Response/ApiResponse';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [
    NgIf,
    NgClass, CommonModule, FormsModule,
  ],
  templateUrl: './shipping.component.html',
  styleUrl: './shipping.component.scss'
})
export class ShippingComponent implements OnInit{
  selectedMethod: string = '';
  selectedAddressId: any = null;
  address: AddressDTO[] | null = null; // Khai báo đối tượng address (có thể null nếu chưa có dữ liệu)
  userId: number | null = null; // userId ban đầu là null
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selected : boolean = false;
  selectedProvince: number | null = null;
  selectedDistrict: number | null = null;
  selectedWard : number | null = null;
  isUpdate: boolean = false; // Xác định trạng thái cập nhật
  NewAddress: AddressDTO = {
    id: 0,
    street: '',
    district: '',
    ward: '',
    province: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
    firstName: '',
    lastName: '',
    isDefault: false
  };

  constructor(private router: Router, private checkoutService: CheckoutService,
              private navigationService: NavigationService,
              private http: HttpClient, // Khai báo HttpClient để gọi API
              private addressService: AddressServiceService,
              private tokenService: TokenService,
              private locationService: LocationServiceService,
  ) {}

  ngOnInit() {
    this.getProvinces();
    this.userId = this.tokenService.getUserId() // Gọi API khi component được khởi tạo
    this.getAddress();


  }
  goToPayment() {
    this.router.navigate(['/checkout/payment']);
  }

  onSelectionChange(value: string) {
    this.selectedMethod = value;
  }

  getProvinces() {
    this.locationService.getProvinces().subscribe(
      (response) => {
        this.provinces = response;

      },
      (error) => {
        console.error("Lỗi khi lấy danh sách tỉnh:", error);
      }
    );
  }
  getAddress() {
    if (this.userId !== null) {
      this.addressService.getAddressByUserId(this.userId).subscribe(
        (response: ApiResponse<AddressDTO[]>) => {
          this.address = response.data; // Gán toàn bộ response vào address
          console.log(this.address)
        },
        (error) => {
          console.error('Lỗi khi lấy địa chỉ:', error);
        }
      );
    } else {
      console.error('Không tìm thấy userId trong localStorage');
    }
  }
  selectAddress(addr: AddressDTO) {
    this.selectedAddressId = addr.id; // Lưu ID của địa chỉ đã chọn
  }

  confirmCheckout() {
    if (!this.selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }
    const selectedAddress = this.address?.find(a => a.id === this.selectedAddressId);
    console.log("Địa chỉ giao hàng:", selectedAddress?.street ); // Lấy địa chỉ street
  }






}
