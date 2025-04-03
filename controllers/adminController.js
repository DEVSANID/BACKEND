import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // Import Admin Model
import User from "../models/user.js";
import Visitor from "../models/Visitor.js";
import Booking from "../models/Booking.js";
import Event from "../models/event.js";
import Order from "../models/Order.js"; // Import additional models

// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });
    if (admin) return res.status(400).json({ success: false, message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photo: photo || "https://via.placeholder.com/100",s
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, photo: admin.photo },
    });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, photo: admin.photo },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    const totalBookedEvents = await Booking.countDocuments();
    const totalEvents = await Event.countDocuments();

    // Aggregate revenue from ticket bookings
    const totalRevenueTicketsResult = await Booking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } },
    ]);

    // Aggregate revenue from shop orders
    const totalRevenueShopResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amountPaid" } } },
    ]);

    // Extract values safely
    const totalRevenueTickets = totalRevenueTicketsResult.length > 0 ? totalRevenueTicketsResult[0].totalRevenue : 0;
    const totalRevenueShop = totalRevenueShopResult.length > 0 ? totalRevenueShopResult[0].totalRevenue : 0;

    // Debugging logs
    console.log("Total Users:", totalUsers);
    console.log("Total Visitors:", totalVisitors);
    console.log("Total Booked Events:", totalBookedEvents);
    console.log("Total Events:", totalEvents);
    console.log("Total Revenue Tickets:", totalRevenueTickets);
    console.log("Total Revenue Shop:", totalRevenueShop);

    res.json({
      totalUsers,
      totalVisitors,
      totalBookedEvents,
      totalEvents,
      totalRevenueTickets,
      totalRevenueShop,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};
