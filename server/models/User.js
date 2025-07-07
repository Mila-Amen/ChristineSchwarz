import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  address: String,
});

export default mongoose.model("User", userSchema);
