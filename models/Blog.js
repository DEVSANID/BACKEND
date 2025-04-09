import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
