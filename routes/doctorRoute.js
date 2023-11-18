const express =require ("express")
const doctorRoute=express.Router()

const doctorController=require("../controllers/doctorController") 
const { verifyUser } = require("../middlewares/jwt")

//  doctor is added 
doctorRoute.post('/register', doctorController.doctorRegistration)
doctorRoute.post('/otp', doctorController.verifyOtp)
doctorRoute.post('/resend-otp', doctorController.resendOtp)
doctorRoute.post('/login',doctorController.doctorLogin)
doctorRoute.post('/forgot-password',doctorController.forgotPassword)
doctorRoute.post('/reset-password/:id/:token',doctorController.resetPassword)
doctorRoute.post('/details',doctorController.doctorDetails)
doctorRoute.get('/getSpecialisations',doctorController.getSpecialisations) //
doctorRoute.post('/add-slot',verifyUser('doctor'),doctorController.addSlot)
doctorRoute.delete('/delete-slot',verifyUser('doctor'),doctorController.deleteSlot)
doctorRoute.post('/appointments',verifyUser('doctor'),doctorController.getDocAppointment)
doctorRoute.post('/cancel-docappointment',verifyUser('doctor'),doctorController.cancelDocAppointment)
doctorRoute.patch('/endAppointment/:appId',verifyUser('doctor'),doctorController.endAppointment)
doctorRoute.patch('/addPrescription',verifyUser('doctor'),doctorController.addPrescription)
doctorRoute.get('/review/:id',verifyUser('doctor'),doctorController.doctorReviews)









module.exports = doctorRoute;

