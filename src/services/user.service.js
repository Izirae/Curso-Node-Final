import UserManager from "../daos/mongodb/managers/UserMongo.dao.js";
import CartService from "../services/cart.service.js";
import Mail from "../helpers/mail.js";

export default class UserService {
  constructor() {
    this.userDao = new UserManager();
    this.cartService = new CartService();
  }

  async addUser(newUser) {
    let newCart = await this.cartService.createCart();

    let user = await this.userDao.addUser(newUser, newCart);

    return user;
  }

  async findUser(email) {
    let user = await this.userDao.findUser(email);

    return user;
  }

  async updatePassword(email, newPassword) {
    await this.userDao.updatePassword(email, newPassword);
  }

  async findUserById(id) {
    let user = await this.userDao.findUserById(id);

    return user;
  }

  async updateUserRole(id, newRole) {
    await this.userDao.updateUserRole(id, newRole);
  }

  async updateUserLastConnection(id) {
    await this.userDao.updateUserLastConnection(id, Date.now());
  }

  async updateUserDocuments(id, documentationFiles) {
    await this.userDao.updateUserDocuments(id, documentationFiles);
  }

  async findUsersProfile() {
    let users = await this.userDao.findUserProfile();
    return users;
  }

  async deleteInactiveUser() {
    let result = await this.userDao.InactiveUser();
    return result;
  }

  async deleteUser(id) {
    let result = await this.userDao.deleteUser(id);
    return result;
  }
}
