const express =require ("express")
const doctorRoute=express.Router()

const doctorController=require("../controllers/doctorController") 

//  doctor is added 
doctorRoute.post('/register', doctorController.doctorRegistration)
doctorRoute.post('/otp', doctorController.verifyOtp)
doctorRoute.post('/resend-otp', doctorController.resendOtp)
doctorRoute.post('/login',doctorController.doctorLogin)
doctorRoute.post('/forgot-password',doctorController.forgotPassword)
doctorRoute.post('/reset-password/:id/:token',doctorController.resetPassword)
doctorRoute.post('/details',doctorController.doctorDetails)
doctorRoute.post('/add-slot',doctorController.addSlot)
doctorRoute.delete('/delete-slot',doctorController.deleteSlot)





module.exports = doctorRoute;

