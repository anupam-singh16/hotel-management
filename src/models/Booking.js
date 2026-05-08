const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  guestName: String,
  guestEmail: String,
  guestPhone: String,
  checkInDate: Date,
  checkOutDate: Date,
  status: {
    type: String,
    enum: ["checked-in", "checked-out"],
    default: "checked-in",
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
