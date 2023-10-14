const express = require("express");
const adminRoute = express.Router();

const adminController = require("../controllers/adminController");
const { validateAdminToken } = require("../middlewares/jwt");

adminRoute.post("/login", adminController.adminLogin);
adminRoute.get("/users", validateAdminToken, adminController.userList); //d
adminRoute.get("/departments" ,validateAdminToken,adminController.departmentList); //D
adminRoute.post("/add_department",validateAdminToken, adminController.createDepartment); //D
adminRoute.get("/doctors",validateAdminToken, adminController.doctorList); //d
adminRoute.post("/blockDoctor",validateAdminToken, adminController.doctorBlockUnblock);//d
adminRoute.post("/approveDoctor", validateAdminToken,adminController.doctorApprove);//d
adminRoute.post("/doc-document",validateAdminToken, adminController.docDocument);//d
adminRoute.post("/doc-details", validateAdminToken, adminController.docDetails);

module.exports = adminRoute;
