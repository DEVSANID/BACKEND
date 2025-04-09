import Blog from '../models/Blog.js';

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new blog with image upload
export const createBlog = async (req, res) => {
  try {
    const { title, author, content, date, location } = req.body;

    // Ensure an image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image upload is required' });
    }

    // Construct full image URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newBlog = new Blog({
      title,
      author,
      content,
      date,
      location,
      imageUrl,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog); // Send saved blog back to frontend
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};
