//MONGOOSE CONNECTION
const {connect} = require("mongoose");
// mongoose.set("strictQuery", false);

const dbConnect = async() => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("Db connected");
  } catch (error) {   
     console.log('db error',process.env.MONGODB_URL);

    // throw error
  }
};

// mongoose.connection.on("disconnected",()=>{console.log('mongodb connection failed')})
module.exports = dbConnect;
