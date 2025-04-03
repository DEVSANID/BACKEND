import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: true }, 
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        lastLogin: { type: Date }
    },
    { timestamps: true } 
);

// Ensure password is explicitly selected when needed
UserSchema.pre('findOne', function(next) {
    this.select('+password'); 
    next();
});

// ✅ Fix: Prevent multiple model registration
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
