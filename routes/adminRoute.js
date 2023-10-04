const express =require ("express")
const adminRoute=express.Router()

const adminController=require("../controllers/adminController") 



adminRoute.post('/login', adminController.adminLogin)
adminRoute.get('/users', adminController.userList)
adminRoute.get('/departments', adminController.departmentList)
adminRoute.post('/add_department', adminController.createDepartment)
adminRoute.get('/doctors', adminController.doctorList)
adminRoute.post('/blockDoctor', adminController.doctorBlockUnblock)
adminRoute.post('/approveDoctor', adminController.doctorApprove)
adminRoute.post('/doc-document', adminController.docDocument)
adminRoute.post('/doc-details', adminController.docDetails)










module.exports = adminRoute;