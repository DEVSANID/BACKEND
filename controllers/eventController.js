import Event from "../models/event.js";

// Create Event
export const CreateEvent = async (req, res) => {
  try {
    const { title, venue, startTime, endTime, startDate, endDate, description } = req.body;

    // Check required fields
    if (!title || !venue || !startTime || !endTime || !startDate || !endDate || !description) {
      return res.status(400).json({ message: "All fields except imageUrl are required" });
    }

    // ✅ If an image is uploaded, set the imageUrl from Multer
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({ title, venue, startTime, endTime, startDate, endDate, description, imageUrl });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetEvents = async (req, res) => {
  try {
    const events = await Event.find();

    // ✅ Ensure imageUrl has full path
    const updatedEvents = events.map((event) => {
      return {
        ...event._doc, // Spread event data
        imageUrl: event.imageUrl ? `http://localhost:5000${event.imageUrl}` : null,
      };
    });

    res.status(200).json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
