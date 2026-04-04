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
  phoneNumber: {
    type: String,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
  },
  password: {
    type: String,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ["male", "female"]
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;