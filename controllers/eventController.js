import Event from "../models/event.js";

// Create Event
export const CreateEvent = async (req, res) => {
  try {
    const { title, venue, startTime, endTime, startDate, endDate, description } = req.body;

    if (!title || !venue || !startTime || !endTime || !startDate || !endDate || !description) {
      return res.status(400).json({ message: "All fields except imageUrl are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({ title, venue, startTime, endTime, startDate, endDate, description, imageUrl });
    await newEvent.save();

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Events
export const GetEvents = async (req, res) => {
  try {
    const events = await Event.find();
    const updatedEvents = events.map((event) => ({
      ...event._doc,
      imageUrl: event.imageUrl ? `http://localhost:5000${event.imageUrl}` : null,
    }));

    res.status(200).json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Event by ID
export const GetEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = {
      ...event._doc,
      imageUrl: event.imageUrl ? `http://localhost:5000${event.imageUrl}` : null,
    };

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Event
export const UpdateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updatedData = req.body;

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEventWithFullPath = {
      ...updatedEvent._doc,
      imageUrl: updatedEvent.imageUrl ? `http://localhost:5000${updatedEvent.imageUrl}` : null,
    };

    res.status(200).json({ message: "Event updated successfully", event: updatedEventWithFullPath });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Event
export const DeleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
