const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "doctor",
    },
    image: {
      type: String,
    },
    gender: {
      type: String,
    },
    otp: {
      type: String,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },

    is_verified: {
      type: Boolean,
      default: false,
    },
    is_approved: {
      type: Boolean,
      default: false,
    },

    specialisation: {
      type: String,
      default: "",
    },
    city: {
      type: String,
    },
    videoCallFees: {
      type: Number,
    },
    status: {
      type: String,
      default: "pending",
    },
    qualification: {
      type: [String],
      default: "",
    },
    profile: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    registrationCouncil: {
      type: String,
    },
    registrationYear: {
      type: String,
    },
    availableSlots: [
      {
        type: String,
      },
    ],
    bookedSlots: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("doctor", doctorSchema);
