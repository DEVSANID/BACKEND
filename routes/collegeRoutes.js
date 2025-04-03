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
    fs.mkdirSync(uploadDir);
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

// ✅ Get all colleges (Trending Colleges)
router.get("/trending", async (req, res) => {
    try {
        const colleges = await College.find().sort({ rating: -1 });
        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Create a new college (Admin Only)
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const { name, location, rating } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const newCollege = new College({ name, location, rating, image });
        await newCollege.save();
        
        res.status(201).json({ message: "College added successfully!", newCollege });
    } catch (error) {
        res.status(500).json({ message: "Error adding college", error });
    }
});

// ✅ Update a college (Admin Only)
router.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
        const { name, location, rating } = req.body;
        let image = req.body.image;

        if (req.file) {
            const oldCollege = await College.findById(req.params.id);
            if (oldCollege && oldCollege.image) {
                const oldImagePath = path.join(process.cwd(), oldCollege.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            image = `/uploads/${req.file.filename}`;
        }

        const updatedCollege = await College.findByIdAndUpdate(
            req.params.id,
            { name, location, rating, image },
            { new: true }
        );

        res.status(200).json({ message: "College updated!", updatedCollege });
    } catch (error) {
        res.status(500).json({ message: "Error updating college", error });
    }
});

// ✅ Delete a college (Admin Only)
router.delete("/delete/:id", async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        if (college.image) {
            const imagePath = path.join(process.cwd(), college.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await College.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "College deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting college", error });
    }
});

export default router;
