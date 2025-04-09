import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import Booking from "../models/Booking.js"; // Adjust path as needed

const router = express.Router();

// Simulate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload ticket PDF and update booking
router.post("/upload", async (req, res) => {
  const { ticketPdf, paymentId, name } = req.body;

  if (!ticketPdf || !paymentId || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ✅ Decode PDF base64 data
    const base64Data = ticketPdf.replace(/^data:application\/pdf;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // ✅ Create file name and paths
    const safeName = name.replace(/\s+/g, "_");
    const fileName = `${safeName}_${paymentId}.pdf`;
    const ticketsDir = path.join(__dirname, "../tickets");
    const filePath = path.join(ticketsDir, fileName);
    const ticketPath = `/tickets/${fileName}`;

    // ✅ Ensure tickets directory exists
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir);
    }

    // ✅ Save PDF buffer to disk
    fs.writeFileSync(filePath, buffer);
    console.log("✅ Ticket saved at:", filePath);

    // ✅ Update booking with ticketPath
    const booking = await Booking.findOneAndUpdate(
      { paymentId },
      { ticketPath },
      { new: true }
    );

    if (!booking) {
      console.log("❌ Booking not found for:", { paymentId });
      return res.status(404).json({ error: "Booking not found to attach ticket." });
    }

    console.log("✅ Booking updated:", booking);

    res.status(200).json({
      message: "Ticket uploaded and linked to booking.",
      ticketPath,
    });

  } catch (error) {
    console.error("❌ Error saving ticket:", error);
    res.status(500).json({ error: "Server error saving ticket." });
  }
});

// ✅ Serve ticket as inline PDF in browser
router.get("/view/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../tickets", filename);

  // ✅ Ensure file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Ticket not found.");
  }

  // ✅ Set headers for inline viewing
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default router;
