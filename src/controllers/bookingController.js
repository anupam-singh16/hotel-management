const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { sendNotification } = require("../services/notificationService");

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

// ✅ Send checkout reminders (checks bookings with checkout in next 2 hours)
exports.sendCheckoutReminders = async (req, res) => {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Find all checked-in bookings with checkout time within next 2 hours
    const bookingsForReminder = await Booking.find({
      status: "checked-in",
      checkOutDate: {
        $gte: now,
        $lte: twoHoursFromNow,
      },
    }).populate("room");

    if (bookingsForReminder.length === 0) {
      return res.json({
        message: "No bookings require checkout reminder",
        count: 0,
        notifications: [],
      });
    }

    // Send notifications to all guests checking out soon
    const notifications = [];
    for (const booking of bookingsForReminder) {
      try {
        const notification = await sendNotification({
          guestName: booking.guestName,
          checkOutDate: booking.checkOutDate,
          roomNumber: booking.room?.roomNumber || "Unknown",
          guestEmail: booking.guestEmail,
        });
        
        // Mark reminder as sent
        booking.reminderSent = true;
        await booking.save();
        
        notifications.push({
          bookingId: booking._id,
          guestName: booking.guestName,
          notification,
        });
      } catch (error) {
        console.error(`Failed to send notification for ${booking.guestName}:`, error.message);
      }
    }

    res.json({
      message: "Checkout reminders sent successfully",
      count: notifications.length,
      bookingsCount: bookingsForReminder.length,
      notifications: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get bookings with checkout within 2 hours (without sending notifications)
exports.getCheckoutReminders = async (req, res) => {
  try {
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const bookingsForReminder = await Booking.find({
      status: "checked-in",
      checkOutDate: {
        $gte: now,
        $lte: twoHoursFromNow,
      },
    }).populate("room");

    res.json({
      message: "Bookings with checkout in next 2 hours",
      count: bookingsForReminder.length,
      data: bookingsForReminder,
      checkTime: now,
      reminderWindow: {
        from: now,
        to: twoHoursFromNow,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
