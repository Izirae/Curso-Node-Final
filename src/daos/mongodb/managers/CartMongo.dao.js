import { cartsModel } from "../models/carts.model.js";

export default class CartManager {
  async createCart() {
    const result = await cartsModel.create({ products: [] });
    return result;
  }

  async getCartById(id) {
    const result = await cartsModel
      .findOne({ _id: id })
      .populate("products.product");
    return result;
  }

  async getCarts() {
    const result = await cartsModel.find({}).populate("products.product");
    return result;
  }

  async addProductToCart(cid, newProduct) {
    const cart = await this.getCartById(cid);

    let product = cart.products.find(
      (prod) => prod.product._id.toString() === newProduct._id.toString()
    );

    if (!product) {
      cart.products.push({ product: newProduct, quantity: 1 });
    } else {
      product.quantity += 1;
    }

    await cart.save();

    return;
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);
      cart.products = cart.products.filter(
        (prod) => prod.product._id.toString() !== pid
      );
      await cart.save();

      return;
    } catch (error) {
      throw new Error("Product does not exist");
    }
  }

  async deleteAllProductsFromCart(cid) {
    const cart = await this.getCartById(cid);
    cart.products = [];
    await cart.save();

    return;
  }

  async replaceProductsFromCart(cid, newProducts) {
    const cart = await this.getCartById(cid);
    cart.products = newProducts;
    await cart.save();

    return;
  }

  async updateProductQuantityFromCart(cid, pid, newQuantity) {
    const cart = await this.getCartById(cid);
    let product = cart.products.find(
      (prod) => prod.product._id.toString() === pid
    );
    product.quantity = newQuantity;

    await cart.save();

    return;
  }

  async getAllProductsFromCart(id) {
    const cart = await cartsModel
      .findOne({ _id: id })
      .populate("products.product")
      .lean();

    return cart.products;
  }

  async deleteCartById(id) {
    await cartsModel.deleteOne({ _id: id });
    return;
  }
}
