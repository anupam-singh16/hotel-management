const Booking = require("../models/Booking");
const Room = require("../models/Room");

exports.checkIn = async (req, res) => {
  try {
    const { roomId, guestName, checkInDate, checkOutDate } = req.body;

    if (!roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 🔴 Check overlapping bookings
    const existingBooking = await Booking.findOne({
      room: roomId,
      status: "checked-in",
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Room already booked for selected dates",
      });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      room: roomId,
      guestName,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
// // Check-In
// exports.checkIn = async (req, res) => {
//   const { roomId, guestName, checkInDate, checkOutDate } = req.body;

//   const room = await Room.findById(roomId);
//   console.log(room, "room/.????????????????????????????");

//   if (!room || !room.isAvailable) {
//     return res.status(400).json({ message: "Room not available" });
//   }

//   const booking = await Booking.create({
//     room: roomId,
//     guestName,
//     checkInDate,
//     checkOutDate,
//   });

//   room.isAvailable = false;
//   await room.save();

//   res.json(booking);
// };

// Check-Out
exports.checkOut = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  booking.status = "checked-out";
  await booking.save();

  const room = await Room.findById(booking.room);
  room.isAvailable = true;
  await room.save();

  res.json({ message: "Checked out successfully" });
};

// ✅ Get all booked rooms
exports.getBookedRooms = async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "checked-in",
    }).populate("room"); // join room details

    res.json({
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get booked rooms between dates
exports.getBookedRoomsByDate = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Dates required" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const bookings = await Booking.find({
      status: "checked-in",
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    }).populate("room");

    res.json({
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
