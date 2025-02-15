export class RegisterDTO {
  name: string;

  phone: string;

  email: string;

  password: string;

  retype_password: string;

  // facebook_account_id: string;
  // google_account_id: string;

  role_id: number = 2;
  constructor(data: any) {
    this.name = data.fullname;
    this.phone = data.phone_number;
    this.email = data.address;
    this.password = data.password;
    this.retype_password = data.retype_password;
    // this.facebook_account_id = data.facebook_account_id || null;
    // this.google_account_id = data.google_account_id || null;
    this.role_id = data.role_id || 2;
  }
}
