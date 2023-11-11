const mongoose = require("mongoose");


const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
      doctorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "doctor",
        required: true,
      },
      slot:{
        type:String,
      },
      status: {
        type: String,
        default: "Confirmed",
      },
      appointment_id:{
        type:Number
      },
      amount_paid:{
        type:Number,
      },
      payment_status:{
        type:String
      },
      payment_mode:{
        type:String,
        default:'online'
      },
      isCancelled:{
        type:Boolean,
        default:false
      },
      isAttended:{
        type:Boolean,
        default:false
      },
      medicines:{
        type:Object
      }

  }, {
    timestamps: true,
  });

module.exports = mongoose.model("Appointment", AppointmentSchema);
