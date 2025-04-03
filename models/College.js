import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { 
        type: String, 
        required: true, 
        get: (image) => image ? `http://localhost:5000${image}` : "https://via.placeholder.com/150"
    }, // Store full URL
    location: { type: String, required: true },
    rating: { type: Number, required: true },
}, { toJSON: { getters: true } }); // ✅ Enable getters to apply the full image URL

const College = mongoose.model("College", CollegeSchema);
export default College;
