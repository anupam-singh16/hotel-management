const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Enable CORS
app.use(cors());

// ✅ Parse JSON
app.use(express.json());

// Routes
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));

module.exports = app;
