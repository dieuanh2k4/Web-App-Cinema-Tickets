export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Customer {
  id: number;
  name: string;
  birth: string;
  gender: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
}