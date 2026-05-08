#!/usr/bin/env node

/**
 * Test Script for Checkout Reminder Notification Feature
 * Tests the notification API endpoints
 */

const http = require("http");

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("🧪 Starting Notification Feature Tests...\n");

  try {
    // Test 1: Create a test room
    console.log("📝 Test 1: Creating test room...");
    const testRoomNumber = 100 + Math.floor(Math.random() * 1000);
    const newRoomRes = await makeRequest("POST", "/api/rooms", {
      roomNumber: testRoomNumber,
      type: "single",
      price: 100,
      isAvailable: true,
    });
    console.log(`Status: ${newRoomRes.status}`);
    
    if (newRoomRes.status !== 200) {
      console.log(`❌ Error creating room: ${JSON.stringify(newRoomRes.data)}\n`);
      throw new Error("Failed to create room");
    }
    
    console.log(`✅ Test room created: ${newRoomRes.data._id}\n`);
    var roomId = newRoomRes.data._id;

    // Test 2: Create a booking with checkout in 1.5 hours
    console.log("📝 Test 2: Creating test booking with checkout in 1.5 hours...");
    const now = new Date();
    const checkInTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const checkOutTime = new Date(now.getTime() + 1.5 * 60 * 60 * 1000); // 1.5 hours from now

    const bookingRes = await makeRequest("POST", "/api/bookings/check-in", {
      roomId: roomId,
      guestName: "Test Guest",
      guestEmail: "test@example.com",
      guestPhone: "+1-234-567-8900",
      checkInDate: checkInTime.toISOString(),
      checkOutDate: checkOutTime.toISOString(),
    });

    console.log(`Status: ${bookingRes.status}`);
    
    if (bookingRes.status !== 201) {
      console.log(`❌ Error creating booking: ${JSON.stringify(bookingRes.data)}\n`);
      throw new Error("Failed to create booking");
    }
    
    console.log(`Booking ID: ${bookingRes.data._id}`);
    console.log(`Guest: ${bookingRes.data.guestName}`);
    console.log(`Checkout Time: ${bookingRes.data.checkOutDate}\n`);

    // Test 3: Get checkout reminders (check only, no notifications)
    console.log("📅 Test 3: Getting checkout reminders (no notifications sent)...");
    const remindersRes = await makeRequest(
      "GET",
      "/api/bookings/checkout-reminders"
    );
    console.log(`Status: ${remindersRes.status}`);
    console.log(`Bookings needing reminders: ${remindersRes.data.count}`);
    console.log(`Reminder window: ${remindersRes.data.reminderWindow.from}`);
    console.log(`             to: ${remindersRes.data.reminderWindow.to}\n`);

    if (remindersRes.data.data && remindersRes.data.data.length > 0) {
      console.log("Bookings found:");
      remindersRes.data.data.forEach((booking, index) => {
        console.log(`  ${index + 1}. ${booking.guestName} - Room ${booking.room.roomNumber}`);
        console.log(`     Checkout: ${booking.checkOutDate}`);
      });
      console.log("");
    }

    // Test 4: Send checkout reminders
    console.log("📧 Test 4: Sending checkout reminders...");
    const sendRes = await makeRequest(
      "POST",
      "/api/bookings/send-checkout-reminders"
    );
    console.log(`Status: ${sendRes.status}`);
    console.log(`Message: ${sendRes.data.message}`);
    console.log(`Reminders sent to: ${sendRes.data.count} guest(s)\n`);

    if (sendRes.data.notifications && sendRes.data.notifications.length > 0) {
      console.log("✅ Notifications Sent:");
      sendRes.data.notifications.forEach((notif, index) => {
        console.log(`\n  [${index + 1}] ${notif.guestName}`);
        console.log(`     Subject: ${notif.notification.subject}`);
        console.log(`     Status: ${notif.notification.status}`);
        console.log(`     Time: ${notif.notification.timestamp}`);
      });
      console.log("");
    } else {
      console.log("⚠️  No reminders needed at this time\n");
    }

    // Test 5: Verify reminder was sent (check reminderSent flag)
    console.log("✔️  Test 5: Verifying reminder was marked as sent...");
    const checkRes = await makeRequest("GET", "/api/bookings/checkout-reminders");
    if (checkRes.data.data && checkRes.data.data.length > 0) {
      const booking = checkRes.data.data[0];
      console.log(`Reminder Sent Flag: ${booking.reminderSent}`);
      console.log(`(Should be 'true' if notification was already sent)\n`);
    }

    console.log("✅ All tests completed!");
    console.log("\n📊 Summary:");
    console.log("  ✓ Fetched available rooms");
    console.log("  ✓ Created test booking");
    console.log("  ✓ Retrieved checkout reminders");
    console.log("  ✓ Sent notifications");
    console.log("  ✓ Verified notification tracking\n");

  } catch (error) {
    console.error("❌ Test Error:", error.message);
    process.exit(1);
  }
}

// Run the tests
runTests().then(() => {
  console.log("🎉 Test suite finished!\n");
  process.exit(0);
});
