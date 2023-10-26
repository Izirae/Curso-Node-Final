import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import config from "./config.js";
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerMessages from "./routes/messages.router.js";
import routerViews from "./routes/views.router.js";
import routerSession from "./routes/session.router.js";
import routerUsers from "./routes/users.router.js";
import { Server } from "socket.io";
import ProductService from "./services/products.service.js";
import MessageService from "./services/messages.service.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassportGithub from "./config/github.passport.js";
import initializePassportLocal from "./config/local.passport.js";
import { initializePassportJWT } from "./config/jwt.passport.js";
import { errorMiddleware } from "./middlewares/error.js";
import { addLogger } from "./logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const db = async (mongoUrl) => {
  try {
    let connection = await mongoose.connect(mongoUrl);
    console.log("Database connected");
    return connection;
  } catch (error) {
    console.error("Can't connect to database", error);
  }
}

db(config.MONGO_URL);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(cookieParser());

initializePassportGithub();
initializePassportLocal();
initializePassportJWT();
app.use(passport.initialize());

app.use(addLogger);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Proyecto de Back",
      description: "Documentación del proyecto de Back - Coderhouse",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const expressServer = app.listen(config.PORT, () =>
  console.log(`Server up, port ${config.PORT}`)
);
const socketServer = new Server(expressServer);

app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
});

app.use("/", routerViews);

app.use("/api/messages", routerMessages);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/api/sessions", routerSession);
app.use("/api/users", routerUsers);

socketServer.on("connection", async (socket) => {
  console.log("Estas conectado " + socket.id);

  let productService = new ProductService();

  let products = await productService.getAllProducts();
  socket.emit("initCars", products);

  socket.on("addCar", async (productData) => {
    await productService.addProduct(productData);
    products = await productService.getAllProducts();
    socketServer.emit("initCars", products);
  });

  socket.on("deleteCar", async (productID) => {
    await productService.deleteProduct(productID);

    products = await productService.getAllProducts();
    socketServer.emit("initCars", products);
  });

  let messageService = new MessageService();
  socket.emit("imprimir", await messageService.getMessages());
  socket.on("message", async (newMessage) => {
    await messageService.addMessage(newMessage);
    socketServer.emit("imprimir", await messageService.getMessages());
  });

  socket.on("authenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });
});

// app.use(errorMiddleware);
