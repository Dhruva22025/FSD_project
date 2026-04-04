import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    minlength: 6
  },
  rating: {
    type: Number,
    default: 1000,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;