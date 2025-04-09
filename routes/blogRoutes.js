import express from 'express';
import { getBlogs, createBlog } from '../controllers/blogController.js';
import { upload } from '../middlewares/multerConfig.js'; // ✅ Make sure filename matches

const router = express.Router();

router.get('/', getBlogs);
router.post('/', upload.single('image'), createBlog); // ✅ Handles image uploads

export default router;
