import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profiles" || file.fieldname === "products") {
      cb(null, `${__dirname}/public/img/${file.fieldname}`);
    } else {
      cb(null, `${__dirname}/public/img/documents/${file.fieldname}`);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({
  storage: storage,
});

export default uploader;
