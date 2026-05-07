const express = require("express");
const router = express.Router();
const {
  createRoom,
  getAvailableRooms,
  getAvailableRoomsByDate,
  getRoomById,
} = require("../controllers/roomController");

router.post("/", createRoom);
router.get("/available-room", getAvailableRooms);

// ✅ new (IMPORTANT)
router.get("/available-by-date", getAvailableRoomsByDate);

// ✅ new route
router.get("/:roomId", getRoomById);

module.exports = router;
