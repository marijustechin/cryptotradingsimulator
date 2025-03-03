export interface IUser {
  id: string | null;
  role: string | null;
  balance: number | null;
}

export interface IUserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}
