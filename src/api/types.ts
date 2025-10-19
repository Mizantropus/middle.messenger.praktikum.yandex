export interface SignUpFormModel {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignInFormModel {
  login: string;
  password: string;
}

export interface ProfilePasswordModel {
  oldPassword: string;
  newPassword: string;
}

export interface ProfileFormModel {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  phone: string;
  email: string;
}
