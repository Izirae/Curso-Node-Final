import ProductService from "../services/products.service.js";
import config from "../config.js";
import Mail from "../helpers/mail.js";

let productService = new ProductService();

const getProducts = async (req, res, next) => {
  try {
    let limit = req.query.limit;
    let page = req.query.page;
    let sort = req.query.sort;
    let filter = req.query.filter;
    let filterValue = req.query.filterValue;

    let products = await productService.getProducts(
      limit,
      page,
      sort,
      filter,
      filterValue
    );

    let response = {
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
    };

    res.send(response);
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    let id = req.params.pid;

    let product = await productService.getProductById(id);

    res.send(product);
  } catch (error) {
    return next(error);
  }
};

const addProduct = async (req, res, next) => {
  try {
    let newProduct = req.body;

    if (req.user.email != config.ADMIN_NAME) {
      newProduct.owner = req.user.email;
    }

    await productService.addProduct(newProduct);

    const products = await productService.getProducts();
    req.socketServer.sockets.emit("updateCar", products);

    res.send({ status: "success" });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let id = req.params.pid;

    let product = await productService.getProductById(id);
    if (!(req.user.role === "admin" || product.owner === req.user.email)) {
      return res.status(403).send({
        status: "failure",
        details: "You don't have access. You are not the product owner",
      });
    }

    let newProduct = req.body;

    await productService.updateProduct(id, newProduct);

    res.send({ status: "success" });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    let id = req.params.pid;

    let product = await productService.getProductById(id);

    if (!(req.user.role === "admin" || product.owner === req.user.email)) {
      return res.status(403).send({
        status: "failure",
        details: "You don't have access. You are not the product owner",
      });
    }
    if (product.owner !== "admin") {
      let mail = new Mail();

      await mail.sendByMail(
        product.owner,
        "Producto Eliminado",
        "Un producto que creaste fue eliminado"
      );
    }

    await productService.deleteProduct(id);

    const products = await productService.getProducts();
    req.socketServer.sockets.emit("updateCar", products);

    res.send({ status: "success" });
  } catch (error) {
    return next(error);
  }
};

export default {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
