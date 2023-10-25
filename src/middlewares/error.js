import { ErrorEnum } from "../services/error/enum.js";

export const errorMiddleware = (error, req, res, next) => {
  if (error) {
    req.logger.error(`Error name: ${error.name}`)

    switch (error.code) {
      case ErrorEnum.ROUTING_ERROR:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      case ErrorEnum.INVALID_TYPES_ERROR:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      case ErrorEnum.DATABASE_ERROR:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      case ErrorEnum.PARAM_ERROR:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      case ErrorEnum.PRODUCT_ALREADY_EXISTS:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      case ErrorEnum.PRODUCT_DOES_NOT_EXIST:
        return res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      default:
        return res.status(400).send({ status: "error", message: "Unhandled Error" });
    }
  }
};
