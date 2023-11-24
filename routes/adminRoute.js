const express = require("express");
const adminRoute = express.Router();

const adminController = require("../controllers/adminController");
const { verifyUser } = require("../middlewares/jwt");

adminRoute.post("/login", adminController.adminLogin);
adminRoute.get("/users", verifyUser('admin'), adminController.userList); //d
adminRoute.get("/departments" ,verifyUser('admin'),adminController.departmentList); //D
adminRoute.post("/add_department",verifyUser('admin'), adminController.createDepartment); //D
adminRoute.post("/blockUser",verifyUser('admin'), adminController.userBlockUnblock); //D
adminRoute.get("/doctors",verifyUser('admin'), adminController.doctorList); //d
adminRoute.post("/blockDoctor",verifyUser('admin'), adminController.doctorBlockUnblock);//d
adminRoute.post("/approveDoctor", verifyUser('admin'),adminController.doctorApprove);//d
adminRoute.post("/doc-document",verifyUser('admin'), adminController.docDocument);//d
adminRoute.post("/doc-details",verifyUser('admin'), adminController.docDetails);


adminRoute.get("/all-bookings",verifyUser('admin'), adminController.allBookings);
adminRoute.get("/user-count",verifyUser('admin'), adminController.userCount);
adminRoute.get("/doctor-count",verifyUser('admin'), adminController.doctorCount);
adminRoute.get("/total-revenue",verifyUser('admin'), adminController.totalRevenue);



module.exports = adminRoute;
