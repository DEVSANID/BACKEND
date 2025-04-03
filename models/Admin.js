import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: "https://via.placeholder.com/100" },
});

export default model("Admin", AdminSchema);
