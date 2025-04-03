import Blog from '../models/Blog.js';



// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new blog with image upload
export const createBlog = async (req, res) => {
  try {
    const { title, date, location } = req.body;
    const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;


    if (!image) {
      return res.status(400).json({ message: 'Image upload is required' });
    }

    const newBlog = new Blog({ title, image, date, location });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog' });
  }
};
