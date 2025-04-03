import { Visitor, Visit } from "../models/Visitor.js";

// ✅ Track Visitors (Create or Update)
export const trackVisitor = async (req, res) => {
  const { name, email, isSubscribed } = req.body;
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // 10 minutes ago

  try {
    let visitor = await Visitor.findOne({ email });

    if (visitor) {
      visitor.visitedAt = Date.now();
      await visitor.save();
    } else {
      visitor = new Visitor({
        name: name || "Anonymous Visitor",
        email: email || `unknown-${Date.now()}@example.com`, // Ensure uniqueness
        isSubscribed: isSubscribed || false,
        visitedAt: Date.now(),
      });
      await visitor.save();
    }

    // ✅ Prevent duplicate visit logs within 10 minutes
    const lastVisit = await Visit.findOne({ visitorId: visitor._id }).sort({ visitedAt: -1 });
    if (!lastVisit || lastVisit.visitedAt < tenMinutesAgo) {
      await new Visit({ visitorId: visitor._id, visitedAt: Date.now() }).save();
    }

    res.status(200).json({ message: "Visitor tracked successfully" });
  } catch (error) {
    console.error("❌ Error tracking visitor:", error);
    res.status(500).json({ message: "Error tracking visitor", error: error.message });
  }
};

// ✅ Get all Visitors (Sorted by Last Visit)
export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ visitedAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    console.error("❌ Error fetching visitors:", error);
    res.status(500).json({ message: "Error fetching visitors", error: error.message });
  }
};

// ✅ Get total visits, unique visitors, and subscriber count
export const getVisitorStats = async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visitor.countDocuments();
    const subscriberCount = await Visitor.countDocuments({ isSubscribed: true });
    res.status(200).json({ totalVisits, uniqueVisitors, subscriberCount });
  } catch (error) {
    console.error("❌ Error fetching visitor stats:", error);
    res.status(500).json({ message: "Error fetching visitor stats", error: error.message });
  }
};

// ✅ Delete a Visitor by ID
export const deleteVisitor = async (req, res) => {
  try {
    const visitorId = req.params.id;

    if (!visitorId) {
      return res.status(400).json({ message: "Visitor ID is required" });
    }

    // ✅ Delete all visits of the visitor before deleting the visitor
    await Visit.deleteMany({ visitorId });

    // ✅ Delete the visitor
    const deletedVisitor = await Visitor.findByIdAndDelete(visitorId);
    if (!deletedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    res.status(200).json({ message: "Visitor and associated visits deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting visitor:", error);
    res.status(500).json({ message: "Error deleting visitor", error: error.message });
  }
};

// ✅ Subscribe Visitor (New or Existing)
export const subscribeVisitor = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let visitor = await Visitor.findOne({ email });

    if (visitor) {
      visitor.isSubscribed = true;
    } else {
      visitor = new Visitor({ email, isSubscribed: true, visitedAt: Date.now() });
    }

    await visitor.save();
    res.status(200).json({ message: "Subscription successful", visitor });
  } catch (error) {
    console.error("❌ Error subscribing visitor:", error);
    res.status(500).json({ message: "Error subscribing visitor", error: error.message });
  }
};

// ✅ Clear All Visitors and Visits (Fixed)
export const clearAllVisitors = async (req, res) => {
  try {
    console.log("⚡ Clearing all visitor data...");

    // ✅ First, delete visits (Avoids breaking visitorId references)
    await Visit.deleteMany({});
    
    // ✅ Then, delete visitors
    const deletedVisitors = await Visitor.deleteMany({});
    console.log(`✅ Deleted ${deletedVisitors.deletedCount} visitors`);

    res.status(200).json({ message: "All visitors and visit data cleared!" });
  } catch (error) {
    console.error("❌ Error clearing all visitor data:", error);
    res.status(500).json({ message: "Failed to clear all visitor data", error: error.message });
  }
};

// ✅ Clear Only Visitors (Keep Visits)
export const clearVisitors = async (req, res) => {
  try {
    console.log("⚡ Clearing only visitors...");

    // Delete only visitors, but NOT visits
    const deletedVisitors = await Visitor.deleteMany({});
    console.log(`✅ Deleted ${deletedVisitors.deletedCount} visitors`);

    res.status(200).json({ message: "All visitors cleared!" });
  } catch (error) {
    console.error("❌ Error clearing visitors:", error);
    res.status(500).json({ message: "Failed to clear visitors", error: error.message });
  }
};

// ✅ Clear Only Visits
export const clearVisits = async (req, res) => {
  try {
    console.log("⚡ Clearing only visits...");

    const deletedVisits = await Visit.deleteMany({});
    console.log(`✅ Deleted ${deletedVisits.deletedCount} visits`);

    res.status(200).json({ message: "All visits cleared!" });
  } catch (error) {
    console.error("❌ Error clearing visits:", error);
    res.status(500).json({ message: "Failed to clear visits", error: error.message });
  }
};
