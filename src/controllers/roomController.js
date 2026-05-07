const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

// Create Room
exports.createRoom = async (req, res) => {
  const room = await Room.create(req.body);
  res.json(room);
};

// Get Available Rooms
exports.getAvailableRooms = async (req, res) => {
  const rooms = await Room.find({ isAvailable: true });
  res.json({ results: rooms });
};

// ✅ Get available rooms by date
exports.getAvailableRoomsByDate = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        message: "checkInDate and checkOutDate are required",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 🔴 Step 1: Find booked rooms (overlapping)
    const bookings = await Booking.find({
      status: "checked-in",
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    // Extract booked room IDs
    const bookedRoomIds = bookings.map((b) => b.room);

    // ✅ Step 2: Find rooms NOT in booked list
    const availableRooms = await Room.find({
      _id: { $nin: bookedRoomIds },
    });

    res.json({
      count: availableRooms.length,
      data: availableRooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    console.log(roomId, "roomId.>>>>>>>>>>>>>.");

    // 🔴 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    // 🔍 Find room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 🔥 OPTIONAL: include bookings of this room
    const bookings = await Booking.find({ room: roomId });

    res.json({
      room,
      bookings, // remove if not needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
