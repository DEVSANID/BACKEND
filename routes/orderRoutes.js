import { Router } from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ FIXED: Added .js extension
import Order from "../models/Order.js"; // ✅ FIXED: Added .js extension

const router = Router();

router.post("/create", authMiddleware, createOrder); // ✅ Save new order
router.get("/my-orders", authMiddleware, getUserOrders); // ✅ Fetch user's orders
router.get("/total-revenue-orders", async (req, res) => {
    try {
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
  
      res.json({ totalRevenue: totalRevenue[0]?.total || 0 });
    } catch (error) {
      console.error("Error fetching total revenue from orders:", error);
      res.status(500).json({ error: "Failed to fetch order revenue" });
    }
  });
export default router;
