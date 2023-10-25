import ProductManager from "../daos/mongodb/managers/ProductMongo.dao.js";

import CustomError from "./error/CustomError.js";
import {
  generateMissingProductsParamsErrorInfo,
  generateProductCodeErrorInfo,
  generateProductIdErrorInfo,
} from "./error/info.js";
import { ErrorEnum } from "./error/enum.js";

export default class ProductService {
  constructor() {
    this.productDao = new ProductManager();
  }

  async getProducts(limit, page, sort, filter, filterValue) {
    let products = await this.productDao.getProducts(
      limit,
      page,
      sort,
      filter,
      filterValue
    );

    return products;
  }

  async getAllProducts() {
    let products = await this.productDao.getAllProducts();

    return products;
  }

  async getProductById(productId) {
    let products = await this.productDao.getProducts();

    for (let prod of products.docs) {
      if (prod._id.toString() === productId.toString()) {
        let product = await this.productDao.getProductById(productId);

        return product;
      }
    }

    CustomError.createError({
      name: "Product does not exist",
      cause: generateProductIdErrorInfo(productId),
      message: "Product couldn't be found",
      code: ErrorEnum.PRODUCT_DOES_NOT_EXIST,
    });
  }

  async getProductByCode(productCode) {
    let products = await this.productDao.getProducts();

    for (let prod of products.docs) {
      if (prod.code.toString() === productCode.toString()) {
        let product = await this.productDao.getProductByCode(productCode);

        return product;
      }
    }

    return false;
  }

  async addProduct(newProduct) {
    let products = await this.productDao.getProducts();

    const requiredParameters = [
      "title",
      "description",
      "price",
      "code",
      "stock",
      "category",
      "status",
    ];

    for (let param of requiredParameters) {
      if (!newProduct[param]) {
        CustomError.createError({
          name: "Missing parameters",
          cause: generateMissingProductsParamsErrorInfo(newProduct),
          message: "Product couldn't be created",
          code: ErrorEnum.PARAM_ERROR,
        });
      }
    }

    for (let prod of products.docs) {
      if (prod.code === newProduct.code) {
        CustomError.createError({
          name: "Product duplicated",
          cause: generateProductCodeErrorInfo(newProduct),
          message: "Product couldn't be created",
          code: ErrorEnum.PRODUCT_ALREADY_EXISTS,
        });
      }
    }

    await this.productDao.addProduct(newProduct);
  }

  async updateProduct(productId, newProduct) {
    await this.productDao.updateProduct(productId, newProduct);
  }

  async deleteProduct(productId) {
    await this.productDao.deleteProduct(productId);
  }
}
