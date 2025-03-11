const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  title: String,
  description: String,
  endDate: { type: Date, required: true }, // Дата окончания акции
});

const Deal = mongoose.model("Deal", dealSchema);

module.exports = Deal;
