const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true, unique: true },
  type: { type: String, enum: ["single", "double", "suite"], required: true },
  price: Number,
  description: String,
  isAvailable: { type: Boolean, default: true },
});

module.exports = mongoose.model("Room", roomSchema);
