import mongoose from "mongoose";
import Order from "../models/Order.js";

// ✅ Create a new order
export async function createOrder(req, res) {
  try {
    const { items, totalAmount, paymentId } = req.body;
    
    // 🔍 Ensure user ID is present
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ Convert to ObjectId

    // 🔍 Validate order data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item." });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount." });
    }
    if (!paymentId) {
      return res.status(400).json({ message: "Missing payment ID." });
    }

    // 🛍️ Create new order
    const order = new Order({
      userId,
      items,
      totalAmount,
      paymentId,
      createdAt: new Date(),
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ message: "Failed to place order. Try again later." });
  }
}

// ✅ Get orders for a user
export async function getUserOrders(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ Convert to ObjectId

    // 📦 Fetch orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ Fetching orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders. Try again later." });
  }
}
