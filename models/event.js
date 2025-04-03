import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  venue: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
});

// ✅ Fix: Prevents re-compiling the model
const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
