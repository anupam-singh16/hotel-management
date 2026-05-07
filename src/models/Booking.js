const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  guestName: String,
  checkInDate: Date,
  checkOutDate: Date,
  status: {
    type: String,
    enum: ["checked-in", "checked-out"],
    default: "checked-in",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
