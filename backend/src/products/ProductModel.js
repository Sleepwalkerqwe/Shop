const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: { type: String, maxlength: 600 },
  profession: String,
  price: { type: Number, required: true },
  oldPrice: Number,
  image: String,
  rating: {
    type: Number,
    default: 0,
  },
  author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
