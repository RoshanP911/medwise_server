const mongoose = require("mongoose");
const objectid = mongoose.Types.ObjectId
const ReviewSchema = new mongoose.Schema({
userId:{
    type: objectid,
    ref: "User",
    required: true,
    },
    doctorId: {
        type: objectid,
        ref: "Doctor",
        required: true,
      },
      rating: { type: Number, required: true },
      feedback: { type: String },
      createdAt: { type: Date, default: Date.now },
      userName:{ type: String },

})
module.exports = mongoose.model("Review", ReviewSchema);