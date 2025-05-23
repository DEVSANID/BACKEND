import College from "../models/College.js";

// Fetch trending colleges
export const getTrendingColleges = async (req, res) => {
  try {
    const colleges = await College.find({ isTrending: true });
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trending colleges" });
  }
};

// Add a new college
export const addCollege = async (req, res) => {
  try {
    const { name, location, isTrending, description } = req.body;
    const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

    if (!name || !location || !image || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCollege = new College({
      name,
      location,
      image,
      isTrending,
      description, // ✅ Add description to the college data
    });

    await newCollege.save();

    res.status(201).json(newCollege);
  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({ message: "Failed to add college" });
  }
};
