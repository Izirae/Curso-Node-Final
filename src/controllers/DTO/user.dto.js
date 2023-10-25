export default class CurrentUserDTO {
  constructor(user) {
    this.name = user.name;
    this.email = user.email;
    this.cart = user.cart;
    this.role = user.role;
  } 
}