const express = require("express");
const adminRoute = express.Router();

const adminController = require("../controllers/adminController");
const { verifyUser } = require("../middlewares/jwt");

adminRoute.post("/login", adminController.adminLogin);
adminRoute.get("/users", verifyUser('admin'), adminController.userList); //d
adminRoute.get("/departments" ,verifyUser('admin'),adminController.departmentList); //D
adminRoute.post("/add_department",verifyUser('admin'), adminController.createDepartment); //D
adminRoute.get("/doctors",verifyUser('admin'), adminController.doctorList); //d
adminRoute.post("/blockDoctor",verifyUser('admin'), adminController.doctorBlockUnblock);//d
adminRoute.post("/approveDoctor", verifyUser('admin'),adminController.doctorApprove);//d
adminRoute.post("/doc-document",verifyUser('admin'), adminController.docDocument);//d
adminRoute.post("/doc-details",verifyUser('admin'), adminController.docDetails);

module.exports = adminRoute;
