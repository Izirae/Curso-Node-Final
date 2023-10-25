import { Router } from "express";
import messagesController from "../controllers/messages.controller.js";
import passport from "passport";
import { userRoleAuth } from "./middlewares/roles.middlewares.js";

let router = Router();

router.get("/", messagesController.getMessages);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  userRoleAuth,
  messagesController.addMessage
);
export default router;
