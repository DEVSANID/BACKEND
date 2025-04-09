import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Booking from "../models/Booking.js";

const router = express.Router();

// Simulate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Upload ticket PDF and update booking — KEEP FIRST
router.post("/upload", async (req, res) => {
  const { ticketPdf, paymentId, name } = req.body;

  if (!ticketPdf || !paymentId || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const base64Data = ticketPdf.replace(/^data:application\/pdf;base64,/, "");
  const fileName = `${name}_${paymentId}.pdf`;
  const relativeTicketPath = `/tickets/${fileName}`;
  const fullPath = path.join(__dirname, `../${relativeTicketPath}`);

  try {
    fs.writeFileSync(fullPath, base64Data, "base64");

    const updatedBooking = await Booking.findOneAndUpdate(
      { paymentId },
      { ticketPath: relativeTicketPath },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Ticket saved and path updated",
      ticketPath: relativeTicketPath,
    });
  } catch (error) {
    console.error("Failed to save PDF:", error);
    res.status(500).json({ error: "Error saving ticket" });
  }
});

// ✅ Total revenue route — KEEP SECOND
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

// ✅ Create a new booking
router.post("/", async (req, res) => {
  try {
    const { eventId, name, email, tickets, mobile, paymentId, amountPaid } = req.body;

    if (!eventId || !name || !email || !tickets || !paymentId || amountPaid === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = new Booking({
      eventId,
      name,
      email,
      tickets,
      mobile,
      amountPaid,
      paymentId,
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful!", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// ✅ Fetch user bookings — KEEP THIS LAST
router.get("/get-bookings/:email", async (req, res) => {

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

export default router;
