import express from "express";
import Booking from "../models/Booking.js"; 

const router = express.Router();

// Create a new booking
router.post("/", async (req, res) => {
  try {
    const { eventId, name, email, tickets, mobile, paymentId, amountPaid } = req.body; // ✅ Ensure amountPaid is received

    if (!eventId || !name || !email || !tickets || !paymentId || amountPaid === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = new Booking({
      eventId,
      name,
      email,
      tickets,
      mobile,
      amountPaid, // ✅ Now correctly passed
      paymentId,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// Fetch user bookings
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const bookings = await Booking.find({ email });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.get("/total-revenue-tickets", async (req, res) => {
  try {
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);

    res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ticket revenue", error });
  }
});

export default router;
