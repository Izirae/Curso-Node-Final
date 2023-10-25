import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  thumbnails: {
    type: [],
    default: [],
  },
  code: {
    type: Number,
    required: true,
    unique: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    ref: "users",
    default: "admin",
  },
});

ProductSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(collection, ProductSchema);
