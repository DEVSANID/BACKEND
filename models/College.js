import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { 
    type: String, 
    required: true, 
    get: (image) => image ? `http://localhost:5000${image}` : "https://via.placeholder.com/150"
  },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true }, // ✅ New field added
}, { 
  toJSON: { getters: true } 
});

const College = mongoose.model("College", CollegeSchema);
export default College;
