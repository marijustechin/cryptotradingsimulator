class UserInfoDto {
  id;
  first_name;
  last_name;
  email;
  phone_number;
  address;
  role;

  constructor(model) {
    this.id = model.id;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.email = model.email;
    this.phone_number = model.phone_number;
    this.address = model.address;
    this.role = model.role;
  }
}

class AllUsersDto {
  id;
  first_name;
  last_name;
  email;
  phone_number;
  address;
  role;
  balance;

  constructor(model) {
    this.id = model.id;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.email = model.email;
    this.phone_number = model.phone_number;
    this.address = model.address;
    this.role = model.role;
    this.balance = model.wallet.balance;
  }
}

module.exports = { UserInfoDto, AllUsersDto };
