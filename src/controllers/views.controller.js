import ViewService from "../services/views.service.js";

let viewService = new ViewService();

const products = async (req, res) => {
  let products = await viewService.getProducts();
  res.render("products", {
    title: "Products",
    products: products.docs,
  });
};

const realTimeProducts = async (req, res) => {
  let user = req.user;

  res.render("realTimeProducts", {
    title: "Productos en tiempo real",
    user: user.role,
  });
};

const chat = async (req, res) => {
  res.render("chat");
};

const home = async (req, res) => {
  let user = req.user;

  if (!user) {
    return res.redirect("/login");
  }

  let limit = req.query.limit;
  let page = req.query.page;
  let sort = req.query.sort;
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;

  if (!limit) {
    limit = 10;
  }
  if (!page) {
    page = 1;
  }

  let products = await viewService.getProducts(limit, page, sort, filtro, filtroVal);

  products.prevLink = products.hasPrevPage
    ? `/home?page=${products.prevPage}&limit=${limit}&sort=${sort}`
    : "";
  products.nextLink = products.hasNextPage
    ? `/home?page=${products.nextPage}&limit=${limit}&sort=${sort}`
    : "";
  res.render("home", {
    title: "Home",
    products: products,
    user: user,
  });
};
const profile = async (req, res) => {
  let user = req.user;

  if (!user) {
    return res.redirect("/login");
  }
  res.render("profile", {
    title: "Profile",
    user: user,
  });
};

const cart = async (req, res) => {
  let cartId = req.params.cid;

  let cartProducts = await viewService.getAllProductsFromCart(cartId);

  let totalPrice = await viewService.getTotalPrice(cartProducts);
  res.render("cart", {
    title: "Cart",
    cartProducts: cartProducts,
    cartId: cartId,
    totalPrice: totalPrice,
  });
};

const login = async (req, res) => {
  res.render("login");
};

const register = async (req, res) => {
  res.render("register");
};

const resetPassword = async (req, res) => {
  res.render("resetPassword");
};

const requestResetPassword = async (req, res) => {
  res.render("requestResetPassword");
};

const admin = async (req, res) => {
  let user = req.user;

  if (user.role !== "admin") {
    return res.redirect("/home");
  }

  res.render("admin", {
    title: "Panel de Administracion",
    user: user,
  });
};

export default {
  home,
  realTimeProducts,
  chat,
  products,
  cart,
  login,
  register,
  resetPassword,
  requestResetPassword,
  profile,
  admin,
};
