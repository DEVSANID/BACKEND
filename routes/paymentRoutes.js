import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto"; // For payment verification

dotenv.config();

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Payment Route
router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 50000,  // Amount in paise (₹500)
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                    .update(sign)
                                    .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ success: false, error: "Invalid signature, payment verification failed!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});

export default router;
