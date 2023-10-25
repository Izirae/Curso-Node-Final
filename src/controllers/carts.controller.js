import CartService from "../services/cart.service.js";
import ProductService from "../services/products.service.js";
import TicketService from "../services/ticket.service.js";
import { v4 as uuidV4 } from "uuid";

let cartService = new CartService();
let ticketService = new TicketService();
let productsService = new ProductService();

const getCarts = async (req, res) => {
  let carts = await cartService.getCarts();

  res.send(carts);
};

const getCartById = async (req, res) => {
  let id = req.params.cid;

  let cart = await cartService.getCartById(id);

  if (!cart) {
    res.send("No se encontró el carrito");
    return;
  }

  res.send(cart.products);
};

const createCart = async (req, res) => {
  await cartService.createCart();

  res.send({ status: "success" });
};

const addProductToCart = async (req, res, next) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    let product = await productsService.getProductById(productId);
    if (product.owner === req.user.email) {
      return res.status(403).send({
        status: "failure",
        details:
          "You are the product owner. You can't add that product to your cart",
      });
    }

    await cartService.addProductToCart(cartId, productId);

    res.send({ status: "success" });
  } catch (error) {
    return next(error);
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    await cartService.deleteProductFromCart(cartId, productId);

    res.send({ status: "success" });
  } catch (error) {
    res.status(400).send({ status: "failure", details: error.message });
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  let cartId = req.params.cid;

  await cartService.deleteAllProductsFromCart(cartId);

  res.send({ status: "success" });
};

const replaceProductsFromCart = async (req, res) => {
  let cartId = req.params.cid;
  let newProducts = req.body;

  await cartService.replaceProductsFromCart(cartId, newProducts);

  res.send({ status: "success" });
};

const updateProductQuantityFromCart = async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  let newQuantity = req.body.quantity;

  await cartService.updateProductQuantityFromCart(
    cartId,
    productId,
    newQuantity
  );

  res.send({ status: "success" });
};

const purchaseProductsFromCart = async (req, res) => {
  let code = uuidV4();

  let purchaseData = await cartService.purchaseAllProductsFromCart(
    req.user.cart
  );
  await cartService.deleteProductsFromCart(
    req.user.cart,
    purchaseData.productsBought
  );

  let ticketData = {
    code: code,
    products: purchaseData.productsBought,
    amount: purchaseData.total,
    purchaser: req.user.email,
  };

  let ticket = await ticketService.createTicket(ticketData);

  let payload = {
    ticket,
    productsUnableToPurchase: purchaseData.productsNotBought,
  };

  res.send({ status: "success", payload: payload });
};

const deleteCartById = async (cartId) => {
  await cartService.deleteCartById(cartId);
  res.send({ status: "success" });
};

export default {
  getCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  replaceProductsFromCart,
  updateProductQuantityFromCart,
  purchaseProductsFromCart,
  deleteCartById,
};
