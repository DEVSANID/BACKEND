import mongoose from "mongoose";

// ✅ Unique Visitor Schema
const visitorSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous Visitor" },
  email: { type: String, default: "unknown@example.com", unique: true },
  isSubscribed: { type: Boolean, default: false },
  visitedAt: { type: Date, default: Date.now },
});

// ✅ Visit Schema (Tracks Every Visit)
const visitSchema = new mongoose.Schema({
  visitedAt: { type: Date, default: Date.now },
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor", required: true },
});

// ✅ Models
const Visitor = mongoose.model("Visitor", visitorSchema);
const Visit = mongoose.model("Visit", visitSchema);

// ✅ Cascade Delete Middleware (Delete All Visits When Visitor is Deleted)
visitorSchema.pre("findOneAndDelete", async function (next) {
  try {
    const visitorId = this._conditions._id; // Fix query access
    if (visitorId) {
      await Visit.deleteMany({ visitorId }); // Delete all visits related to the visitor
    }
    next();
  } catch (error) {
    next(error);
  }
});

export { Visitor, Visit };
export default Visitor;
