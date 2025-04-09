export interface IUser {
  id: string | null;
  role: string | null;
  balance: number | null;
  first_name: string | null;
}

export interface IUserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface IUserExtended {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  role: string;
  balance: number;
  // dar pridesim daugiau lauku
  // pvz kiek operaciju, last login ir pan.
}

export interface IAllUsersInfo {
  users: IUserExtended[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}
