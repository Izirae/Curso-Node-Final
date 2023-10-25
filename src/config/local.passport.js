import passport from "passport";
import LocalStrategy from "passport-local";

import { createHash, validatePassword } from "../utils.js";
import config from "../config.js";

import UserService from "../services/user.service.js";

const userService = new UserService();

const initializePassportLocal = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {

        let user = await userService.findUser(email);

        if (!user) {
          return done(null, false);
        }

        const isValidPassword = await validatePassword(password, user);
        if (!isValidPassword) {
          return done(null, false);
        }

        if (email === config.ADMIN_NAME && password === config.ADMIN_PASSWORD) {
          user = {
            name: "Admin",
            email: config.ADMIN_NAME,
            age: "None",
            role: "admin",
            id: user._id,
            cart: null,
          };
        } else {
          user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            id: user._id,
            cart: user.cart,
          };
        }

        return done(null, user);
      }
    )
  );

  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
          let user = await userService.findUser(email);
          if (user) {
            return done(null, false);
          }

          let newUser = {
            first_name,
            last_name,
            email,
            age,
            role,
            password: createHash(password),
          };

          let result = await userService.addUser(newUser);

          return done(null, result);
        } catch (error) {
          return done("Error at user signup" + error);
        }
      }
    )
  );
};

export default initializePassportLocal;
