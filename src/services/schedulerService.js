// Scheduler Service
// Automatically sends checkout reminders at specified intervals

const Booking = require("../models/Booking");
const { sendNotification } = require("./notificationService");

let schedulerInterval = null;

// Start the scheduler
const startCheckoutReminderScheduler = (intervalMinutes = 30) => {
  console.log(
    `⏰ Starting checkout reminder scheduler (runs every ${intervalMinutes} minutes)`
  );

  schedulerInterval = setInterval(async () => {
    try {
      console.log(`📅 Checking for checkout reminders at ${new Date()}`);

      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // Find bookings with checkout in next 2 hours that haven't been reminded yet
      const bookingsForReminder = await Booking.find({
        status: "checked-in",
        reminderSent: false,
        checkOutDate: {
          $gte: now,
          $lte: twoHoursFromNow,
        },
      }).populate("room");

      if (bookingsForReminder.length === 0) {
        console.log("✅ No reminders needed at this time");
        return;
      }

      console.log(
        `📧 Sending reminders to ${bookingsForReminder.length} guest(s)`
      );

      // Send notifications and update reminder flag
      for (const booking of bookingsForReminder) {
        try {
          await sendNotification({
            guestName: booking.guestName,
            checkOutDate: booking.checkOutDate,
            roomNumber: booking.room?.roomNumber || "Unknown",
            guestEmail: booking.guestEmail,
          });

          // Mark reminder as sent
          booking.reminderSent = true;
          await booking.save();

          console.log(`✅ Reminder sent to ${booking.guestName}`);
        } catch (error) {
          console.error(
            `❌ Failed to send reminder to ${booking.guestName}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error("❌ Scheduler error:", error.message);
    }
  }, intervalMinutes * 60 * 1000);
};

// Stop the scheduler
const stopCheckoutReminderScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("⏹️  Checkout reminder scheduler stopped");
  }
};

// Get scheduler status
const getSchedulerStatus = () => {
  return {
    isRunning: schedulerInterval !== null,
    status: schedulerInterval ? "running" : "stopped",
  };
};

module.exports = {
  startCheckoutReminderScheduler,
  stopCheckoutReminderScheduler,
  getSchedulerStatus,
};
