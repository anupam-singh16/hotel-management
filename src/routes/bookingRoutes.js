const express = require("express");
const router = express.Router();
const {
  checkIn,
  checkOut,
  getBookedRooms,
  getBookedRoomsByDate,
} = require("../controllers/bookingController");

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);

// ✅ new
router.get("/booked", getBookedRooms);
router.get("/booked-by-date", getBookedRoomsByDate);

module.exports = router;
