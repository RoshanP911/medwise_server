const express =require ("express")
const adminRoute=express.Router()

const adminController=require("../controllers/adminController") 



adminRoute.post('/login', adminController.adminLogin)
adminRoute.get('/users', adminController.userList)
adminRoute.get('/departments', adminController.departmentList)
adminRoute.get('/doctors', adminController.doctorList)
adminRoute.post('/blockDoctor', adminController.doctorBlockUnblock)



// adminRoute.get('/doctors', adminController.doctorList)
adminRoute.post('/add_department', adminController.createDepartment)






module.exports = adminRoute;