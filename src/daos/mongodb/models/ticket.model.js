import mongoose from "mongoose";

const collection = "tickets";

let ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  products: {
    type: [],
    default: [],
  },
  amount: {
    type: Number,
  },
  purchaser: {
    type: String,
  },
});

export const ticketsModel = mongoose.model(collection, ticketSchema);
