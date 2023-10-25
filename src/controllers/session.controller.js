import { createHash, validatePassword } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import UserService from "../services/user.service.js";
import CurrentUserDTO from "./DTO/user.dto.js";
import Mail from "../helpers/mail.js";

const userService = new UserService();

const register = async (req, res) => {
  res.send({ status: "success", message: "User has been created" });
};

const registerFail = async (req, res) => {
  res.status(400).send({ status: "error", error: "Authentication failed" });
};

const login = async (req, res) => {
  let user = req.user;
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", details: "Invalid credentials" });
  }

  await userService.updateUserLastConnection(user.id);

  let token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: "24h" });

  return res
    .cookie("authToken", token, { httpOnly: true })
    .send({ status: "success" });
};

const loginFail = async (req, res) => {
  res.status(400).send({ status: "error", details: "Login failed" });
};

const logout = async (req, res) => {
  const user = req.user;
  await userService.updateUserLastConnection(user.id);

  res.clearCookie("authToken");
  res.send({ status: "sucess" });
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  try {
    const user = await userService.findUser(email);
    if (validatePassword(password, user)) {
      return res.status(400).send({
        status: "failure",
        error: "New and old password are the same",
      });
    }

    const newHashedPassword = createHash(password);

    await userService.updatePassword(email, newHashedPassword);

    return res.send({ status: "success", message: "Password updated" });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const requestResetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  }

  try {
    const user = await userService.findUser(email);

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", message: "There is no user with such email" });
    }

    let token = jwt.sign({ email }, config.JWT_PASSWORD_REQUEST, {
      expiresIn: "1h",
    });

    let mail = new Mail();

    await mail.send(
      user,
      "Password reset",
      `
      <div style='color: blue'>
        <h1> Restaura tu email haciendo click en el siguiente link </h1>
        http://localhost:8080/resetPassword?token=${token}
      </div>
      `
    );

    return res.send({ status: "success", message: "Email sent" });
  } catch (error) {
    return res.status(404).send({ status: "error", error: error.message });
  }
};

const github = async (req, res) => {

};

const githubcallback = async (req, res) => {
  const user = {
    name: `${req.user.first_name} ${req.user.last_name}`,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role,
    id: req.user._id,
    cart: req.user.cart,
  };

  let token = jwt.sign(user, config.JWT_SECRET, { expiresIn: "24h" });

  return res.cookie("authToken", token, { httpOnly: true }).redirect("/home");
};

const current = async (req, res) => {
  let userDto = new CurrentUserDTO(req.user);

  res.send(userDto);
};

export default {
  register,
  registerFail,
  login,
  loginFail,
  logout,
  resetPassword,
  requestResetPassword,
  github,
  githubcallback,
  current,
};
