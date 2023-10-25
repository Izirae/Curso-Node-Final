import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import passport from "passport";
import {
  adminRoleAuth,
  multipleRolesAuth,
} from "./middlewares/roles.middlewares.js";

const router = Router();

router.get("/", productsController.getProducts);

router.get("/:pid", productsController.getProductById);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  multipleRolesAuth(["admin", "premium"]),
  productsController.addProduct
);

router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  multipleRolesAuth(["admin", "premium"]),
  productsController.updateProduct
);

router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  multipleRolesAuth(["admin", "premium"]),
  productsController.deleteProduct
);

export default router;
