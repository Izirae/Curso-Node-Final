import CartManager from "../daos/mongodb/managers/CartMongo.dao.js";
import ProductService from "./products.service.js";

export default class CartService {
  constructor() {
    this.cartDao = new CartManager();
    this.productService = new ProductService();
  }

  async getCarts() {
    let carts = await this.cartDao.getCarts();

    return carts;
  }

  async getCartById(id) {
    let cart = await this.cartDao.getCartById(id);

    return cart;
  }

  async createCart() {
    let cart = await this.cartDao.createCart();

    return cart;
  }

  async addProductToCart(cartId, productId) {
    let product = await this.productService.getProductById(productId);

    await this.cartDao.addProductToCart(cartId, product);
  }

  async deleteProductFromCart(cartId, productId) {
    await this.cartDao.deleteProductFromCart(cartId, productId);
  }

  async deleteAllProductsFromCart(cartId) {
    await this.cartDao.deleteAllProductsFromCart(cartId);
  }

  async replaceProductsFromCart(cartId, newProducts) {
    await this.cartDao.replaceProductsFromCart(cartId, newProducts);
  }

  async updateProductQuantityFromCart(cartId, productId, newQuantity) {
    await this.cartDao.updateProductQuantityFromCart(
      cartId,
      productId,
      newQuantity
    );
  }

  async getAllProductsFromCart(cartId) {
    let products = await this.cartDao.getAllProductsFromCart(cartId);

    return products;
  }

  async purchaseAllProductsFromCart(cartId) {
    let productsBought = [];
    let total = 0;
    let productsNotBought = [];
    let products = await this.cartDao.getAllProductsFromCart(cartId);

    for (let prod of products) {
      let product = await this.productService.getProductById(prod.product._id);

      if (prod.quantity > product.stock) {
        productsNotBought.push(product._id);
        continue;
      }

      await this.productService.updateProduct(product._id, {
        stock: product.stock - prod.quantity,
      });

      productsBought.push({ productId: product._id, quantity: prod.quantity });

      total += prod.quantity * product.price;
    }

    return { productsBought, total, productsNotBought };
  }

  async deleteProductsFromCart(cartId, products) {
    for (let product of products) {
      await this.deleteProductFromCart(cartId, product.productId.toString());
    }
  }

  async deleteCartById(cartID) {
    await this.cartDao.deleteCartById(cartID);
  }
}
