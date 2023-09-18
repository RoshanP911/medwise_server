const mongoose = require("mongoose");

//schema of model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  age: {
    type: Number,
  },
  token: {
    type: String,
  },
  documents: {
    type: Array,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
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


},{timestamps:true});


//TO DELETE OTP AFTER VERIFYING
// userSchema.pre('save', function (next) {
//   if (this.is_verified) {
//     this.otp = undefined; // Or you can use delete this.otp;
//   }
//   next();
// });






module.exports = mongoose.model("User", userSchema);
