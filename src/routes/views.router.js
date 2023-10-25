import { Router } from "express";
import passport from "passport";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get("/products", viewsController.products);

router.get("/", viewsController.login);

router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), viewsController.realTimeProducts);

router.get("/chat", viewsController.chat);

router.get(
  "/home",
  passport.authenticate("jwt", { session: false }),
  viewsController.home
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  viewsController.profile
);

router.get("/cart/:cid", viewsController.cart);

router.get("/login", viewsController.login);

router.get("/register", viewsController.register);

router.get(
  "/resetPassword",
  passport.authenticate("jwtRequestPassword", {
    session: false,
    failureRedirect: "requestResetPassword",
  }),
  viewsController.resetPassword
);

router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  viewsController.admin
);

router.get("/requestResetPassword", viewsController.requestResetPassword);

export default router;
