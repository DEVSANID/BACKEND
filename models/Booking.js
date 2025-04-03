import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  tickets: { type: Number, required: true },
  mobile: { type: String, required: true },
  paymentId: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
