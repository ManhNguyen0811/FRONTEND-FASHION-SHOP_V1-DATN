import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpUntilService} from '../http.until.service';
import {DOCUMENT} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RegisterDTO} from '../../dto/user/register.dto';
import {catchError, map, Observable, throwError} from 'rxjs';
import {LoginDTO} from '../../dto/user/login.dto';
import {UserResponse} from '../../dto/Response/user/user.response';
import {User} from '../../models/user';
import {ApiResponse} from '../../dto/Response/ApiResponse';
import {UserDetailDTO} from '../../dto/UserDetailDTO';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = `${environment.apiBaseUrl}/users`;

  private apiRegister = `${this.userUrl}/register`;
  private apiLogin = `${this.userUrl}/login`;
  private apiUserDetail = `${this.userUrl}/details`;
  private apiCheckEmail = `${this.userUrl}/check-email`;
  private apiCheckPhone = `${this.userUrl}/check-phone`;
  localStorage?:Storage

  private apiConfig:{headers: any};

  constructor(
    private http: HttpClient,
    private httpUnitlService: HttpUntilService,
    @Inject(DOCUMENT) private document:Document
  ) {
      this.localStorage = document.defaultView?.localStorage;

      this.apiConfig = {
        headers: this.httpUnitlService.createHeaders(),
      };
  }

  register(registerDTO: RegisterDTO):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi' // Hoặc lấy từ setting của user
    });

    return this.http.post<any>(this.apiRegister, registerDTO, { headers });
  }

  login(loginDTO: LoginDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiLogin, loginDTO, this.apiConfig).pipe(
      map(response => {
        if (!response || response.status !== 200 || !response.data) {
          throw new Error(response?.message || 'Đăng nhập thất bại');
        }

        const { token, refresh_token, username, id, roles } = response.data;

        if (!token) {
          throw new Error('Không nhận được token');
        }

        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user_info', JSON.stringify({ username, id, roles }));



        console.log('Đăng nhập thành công, token:', token);

        return response.data;
      }),catchError(error => {
        // Log toàn bộ lỗi từ API
        console.error('Login API error:', error);
        if (error.error) {
          console.error('Chi tiết lỗi từ API:', error.error);
        }

        // Nếu API trả về lỗi, trích xuất thông báo lỗi nếu có
        const errorMessage = error.error?.message || 'Đăng nhập thất bại, vui lòng thử lại.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getUserInfo(): { username: string; id: number; roles: string[] } | null {
    try {
      const userInfoJSON = localStorage.getItem('user_info');
      if (!userInfoJSON) {
        return null;
      }
      return JSON.parse(userInfoJSON);
    } catch (error) {
      // console.error('❌ Lỗi khi lấy thông tin user từ localStorage:', error);
      return null;
    }
  }


  getUserDetail(token: string): Observable<UserDetailDTO> {
    return this.http.post<any>(
      this.apiUserDetail,
      {},
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        })
      }
    ).pipe(
      map(response => response.data as UserDetailDTO) // Lấy `data` từ response
    );
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {

      if(userResponse == null || !userResponse) {
        return;
      }
      // Convert the userResponse object to a JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // Save the JSON string to local storage with a key (e.g., "userResponse")
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  getUserResponseFromLocalStorage():UserResponse | null {
    try {
      // Retrieve the JSON string from local storage using the key
      const userResponseJSON = this.localStorage?.getItem('user');
      if(userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // Parse the JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null; // Return null or handle the error as needed
    }
  }

  removeUserFromLocalStorage():void {
    try {
      // Remove the user data from local storage using the key
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
      // Handle the error as needed
    }
  }

  checkEmail(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(this.apiCheckEmail, { params });
  }

  checkPhone(phone: string): Observable<boolean> {
    const params = new HttpParams().set('phone', phone);
    return this.http.get<boolean>(this.apiCheckPhone, {params});
  }

  // getUserProfile(): Observable<User> {
  //   return this.http.get<User>(`${this.userUrl}/profile`);
  // }
}
