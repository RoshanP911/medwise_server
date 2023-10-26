const express =require ("express")
const doctorRoute=express.Router()

const doctorController=require("../controllers/doctorController") 
const { validateDoctorToken } = require("../middlewares/jwt")

//  doctor is added 
doctorRoute.post('/register', doctorController.doctorRegistration)
doctorRoute.post('/otp', doctorController.verifyOtp)
doctorRoute.post('/resend-otp', doctorController.resendOtp)
doctorRoute.post('/login',doctorController.doctorLogin)
doctorRoute.post('/forgot-password',doctorController.forgotPassword)
doctorRoute.post('/reset-password/:id/:token',doctorController.resetPassword)
doctorRoute.post('/details',doctorController.doctorDetails)
doctorRoute.get('/getSpecialisations',doctorController.getSpecialisations) //
doctorRoute.post('/add-slot',validateDoctorToken,doctorController.addSlot)
doctorRoute.delete('/delete-slot',validateDoctorToken,doctorController.deleteSlot)
doctorRoute.post('/appointments',validateDoctorToken,doctorController.getDocAppointment)
doctorRoute.post('/cancel-docappointment',validateDoctorToken,doctorController.cancelDocAppointment)








module.exports = doctorRoute;

