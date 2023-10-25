import { Router } from "express";
import __dirname from "../utils.js";
import cartsController from "../controllers/carts.controller.js";
import passport from "passport";
import { verifyCartAccess } from "./middlewares/carts.middleware.js";
import {
  multipleRolesAuth,
  userRoleAuth,
} from "./middlewares/roles.middlewares.js";

const router = Router();

router.get("/", cartsController.getCarts);

router.get("/:cid", cartsController.getCartById);

router.post("/", cartsController.createCart);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  multipleRolesAuth(["user", "premium"]),
  verifyCartAccess,
  cartsController.addProductToCart
);

router.delete("/:cid/products/:pid", cartsController.deleteProductFromCart);

router.delete("/:cid", cartsController.deleteAllProductsFromCart);

router.put("/:cid", cartsController.replaceProductsFromCart);

router.put(
  "/:cid/products/:pid",
  cartsController.updateProductQuantityFromCart
);

router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  userRoleAuth,
  verifyCartAccess,
  cartsController.purchaseProductsFromCart
);

export default router;
