import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/user.js";
import Visitor from "../models/Visitor.js";
import Booking from "../models/Booking.js";
import Event from "../models/event.js"; // ✅ Import Event model
import { getDashboardStats } from "../controllers/adminController.js"; // ✅ Import getDashboardStats function

const router = Router();

router.get("/stats", getDashboardStats);

//  Admin Registration Route
router.post("/register", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

    const { name, email, password, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      name,
      email,
      password: hashedPassword,
      photo: photo || "https://via.placeholder.com/100",
    });

    await admin.save();

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });

  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Admin Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });

  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Admin Stats Route (Updated)
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    const totalBookedEvents = await Booking.countDocuments();
    const totalEvents = await Event.countDocuments(); // ✅ Fetch total events

    res.json({ success: true, totalUsers, totalVisitors, totalBookedEvents, totalEvents });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ success: false, message: "Error fetching stats", error });
  }
});

export default router;
