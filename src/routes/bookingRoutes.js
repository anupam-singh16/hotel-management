const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  getBookedRooms,
  getBookedRoomsByDate,
  sendCheckoutReminders,
  getCheckoutReminders,
} = require("../controllers/bookingController");

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

// ✅ new
router.get("/booked", getBookedRooms);
router.get("/booked-by-date", getBookedRoomsByDate);

// ✅ Checkout reminder routes
router.get("/checkout-reminders", getCheckoutReminders);
router.post("/send-checkout-reminders", sendCheckoutReminders);

module.exports = router;
