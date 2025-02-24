import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, Router} from '@angular/router';
import {NavigationService} from '../../../services/Navigation/navigation.service';
import {TranslateModule} from '@ngx-translate/core';
import {Role} from '../../../models/role';
import {UserService} from '../../../services/user/user.service';
import {TokenService} from '../../../services/token/token.service';
import {RoleService} from '../../../services/role/role.service';
import {UserResponse} from '../../../dto/Response/user/user.response';
import {LoginDTO} from '../../../dto/user/login.dto';
import {LoginResponse} from '../../../dto/Response/user/login.response';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import { ModalNotifyLoginComponent } from '../modal-notify-login/modal-notify-login.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, TranslateModule, FormsModule, NgIf,ModalNotifyLoginComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = ''; // Thêm biến lưu lỗi

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse

  onEmailChange() {
    console.log(`Email typed: ${this.email}`);
    //how to validate ? phone must be at least 6 characters
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
        private toastr: ToastrService,

  ) { }

  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles

    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]

        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      complete: () => {

      },
      error: (error: any) => {

        console.error('Error getting roles:', error);
      }
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.errorMessage = params['error'] || null;
    });

  }

  createAccount() {

    // Chuyển hướng người dùng đến trang đăng ký (hoặc trang tạo tài khoản)
    this.router.navigate(['/signin']);
  }

  login() {
    const loginDTO: LoginDTO = {
      email: this.email,
      password: this.password,
      role_id: this.selectedRole?.id ?? 2
    };

    this.userService.login(loginDTO).subscribe({
      next: (data) => {
        console.log('Login Response:', data);

        const token = data.data.token;
        const roles = data.data.roles;

        if (!token) {
          this.errorMessage = 'Không nhận được token từ server.';
          return;
        }

        // Lưu token vào service quản lý token
        this.tokenService.setToken(token);

        // Điều hướng dựa vào vai trò người dùng
        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.errorMessage = error.message || 'Email hoặc mật khẩu không đúng';
        this.toastr.error('Email hoặc mật khẩu không đúng','ERROR',{timeOut: 2000})

      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Toggle hiện/ẩn mật khẩu
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Hàm đăng nhập với Google (placeholder)
  loginWithGoogle() {
    console.log('Login with Google clicked');
    // Bổ sung logic Google OAuth2 sau này
  }
}
