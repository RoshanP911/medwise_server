const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  userName: { type: String },
  rating: { type: Number, required: true },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Review", ReviewSchema);
