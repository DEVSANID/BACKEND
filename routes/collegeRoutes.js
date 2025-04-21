import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import College from "../models/College.js";
import express from "express";

const router = Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Serve uploaded images statically
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Get trending colleges with pagination
// In your college routes file
router.get("/trending", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const skip = parseInt(req.query.skip) || 0;
        
        // Get trending colleges (sorted by rating)
        const colleges = await College.find()
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit);
            
        res.status(200).json(colleges); // Send just the array of colleges
    } catch (error) {
        console.error("Error fetching colleges:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
});

// ✅ Create a new college
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const { name, location, rating, description } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                message: "Image is required" 
            });
        }

        const image = `/uploads/${req.file.filename}`;
        const newCollege = new College({ 
            name, 
            location, 
            rating, 
            description, 
            image 
        });

        await newCollege.save();
        
        res.status(201).json({ 
            success: true,
            message: "College added successfully!", 
            college: newCollege 
        });
    } catch (error) {
        console.error("Error creating college:", error);
        res.status(500).json({ 
            success: false,
            message: "Error adding college",
            error: error.message 
        });
    }
});

// ✅ Update a college
router.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, rating, description } = req.body;
        
        const college = await College.findById(id);
        if (!college) {
            return res.status(404).json({ 
                success: false,
                message: "College not found" 
            });
        }

        let image = college.image;
        if (req.file) {
            // Delete old image if exists
            if (college.image) {
                const oldImagePath = path.join(process.cwd(), college.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image = `/uploads/${req.file.filename}`;
        }

        const updatedCollege = await College.findByIdAndUpdate(
            id,
            { name, location, rating, description, image },
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            success: true,
            message: "College updated successfully!",
            college: updatedCollege 
        });
    } catch (error) {
        console.error("Error updating college:", error);
        res.status(500).json({ 
            success: false,
            message: "Error updating college",
            error: error.message 
        });
    }
});

// ✅ Delete a college
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const college = await College.findById(id);
        
        if (!college) {
            return res.status(404).json({ 
                success: false,
                message: "College not found" 
            });
        }

        // Delete associated image
        if (college.image) {
            const imagePath = path.join(process.cwd(), college.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await College.findByIdAndDelete(id);
        
        res.status(200).json({ 
            success: true,
            message: "College deleted successfully!" 
        });
    } catch (error) {
        console.error("Error deleting college:", error);
        res.status(500).json({ 
            success: false,
            message: "Error deleting college",
            error: error.message 
        });
    }
});

export default router;