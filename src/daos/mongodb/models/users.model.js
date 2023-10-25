import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["user", "admin", "premium"],
    default: "user",
    required: true,
  },
  documents: {
    type: [
      {
        name: {
          type: String
        },
        reference: {
          type: String
        },
      },
    ],
    default: [],
  },
  last_connection: {
    type: String,
    default: Date.now()
  },
});

export const userModel = mongoose.model(collection, schema);
