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
        default: "pending",
      },
      appointment_id:{
        type:Number
      },
      reason:{
        type:String
      },
      payment_mode:{
        type:[String],
        default: "online"
      },
      amount_paid:{
        type:Number,
      },
      payment_status:{
        type:String
      },
      appointment_mode:{
        type:String,
        default:'online'
      },
      findings:{
        type:String
      },
      prescription:[
        {
          medicine:{type:String},
          frequency:{type:String}
        }
      ],
      advice:{type:String}

  }, {
    timestamps: true,
  });

module.exports = mongoose.model("Appointment", AppointmentSchema);
