//MONGOOSE CONNECTION
const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);

const dbConnect = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Db connected");
  } catch (error) {   
     console.log('db error');

    // throw error
  }
};

// mongoose.connection.on("disconnected",()=>{console.log('mongodb connection failed')})
module.exports = dbConnect;
