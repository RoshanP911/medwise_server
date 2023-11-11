const express = require("express");
const app = express();
const userRoute = require("./routes/userRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const doctorRoute = require("./routes/doctorRoute.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { Server } = require("socket.io");
const socketManager=require('./config/socket.js')


require("dotenv").config();

//MONGOOSE CONNECT
const dbConnect = require("./config/mongo.js");
dbConnect();

app.use(logger("dev"));
app.use("/webhook", express.raw({ type: "application/json" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTE SETTING
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/doctor", doctorRoute);

//PORT SETTING
const PORT = process.env.PORT || 9001;
const server=app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});

const io=new Server(server,{ cors: true })
socketManager(io);



