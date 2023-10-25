import ProductService from "./products.service.js";
import CartService from "../services/cart.service.js";

export default class ViewService {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
  }

  async getProducts(limit, page, sort, filter, filterValue) {
    let products = await this.productService.getProducts(
      limit,
      page,
      sort,
      filter,
      filterValue
    );

    return products;
  }

  async getAllProductsFromCart(cartId) {
    let products = await this.cartService.getAllProductsFromCart(cartId);

    return products;
  }

  async getTotalPrice(cartProducts) {
    let total = 0;

    cartProducts.forEach((e) => {
      let price = parseFloat(e.product.price);
      total += price;
    });
    return total;
  }
}
