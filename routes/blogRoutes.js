import express from 'express';
import { getBlogs, createBlog } from '../controllers/blogController.js';
import { upload } from '../middlewares/multerConfig.js'; 

const router = express.Router();

router.get('/', getBlogs);
router.post('/', upload.single('image'), createBlog); 

export default router;
