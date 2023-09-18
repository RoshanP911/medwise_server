const mongoose = require("mongoose");

//schema of model
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
    image: {
        type: String,
      }

},{timestamps:true})

module.exports = mongoose.model("Department", departmentSchema);
