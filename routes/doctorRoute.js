const express =require ("express")
const doctorRoute=express.Router()

const doctorController=require("../controllers/doctorController") 
const { verifyUser } = require("../middlewares/jwt")
const { checkUserBlock } = require("../middlewares/blockCheck")

//  doctor is added 
doctorRoute.post('/register', doctorController.doctorRegistration)
doctorRoute.post('/otp', doctorController.verifyOtp)
doctorRoute.post('/resend-otp', doctorController.resendOtp)
doctorRoute.post('/login',doctorController.doctorLogin)
doctorRoute.post('/forgot-password',doctorController.forgotPassword)
doctorRoute.post('/reset-password/:id/:token',doctorController.resetPassword)
doctorRoute.post('/details',doctorController.doctorDetails)
doctorRoute.get('/getSpecialisations',doctorController.getSpecialisations) //
doctorRoute.post('/add-slot',verifyUser('doctor'),checkUserBlock, doctorController.addSlot)
doctorRoute.delete('/delete-slot',verifyUser('doctor'),checkUserBlock,doctorController.deleteSlot)
doctorRoute.post('/appointments',verifyUser('doctor'),checkUserBlock,doctorController.getDocAppointment)
doctorRoute.post('/cancel-docappointment',verifyUser('doctor'),checkUserBlock,doctorController.cancelDocAppointment)
doctorRoute.patch('/endAppointment/:appId',doctorController.endAppointment)
doctorRoute.patch('/addPrescription',verifyUser('doctor'),checkUserBlock,doctorController.addPrescription)
doctorRoute.get('/review/:id',verifyUser('doctor'),checkUserBlock,doctorController.doctorReviews)


doctorRoute.get('/total-appointments/:id',verifyUser('doctor'),doctorController.totalAppointments)
doctorRoute.get('/appointment-list/:id',verifyUser('doctor'),doctorController.appointmentList)








module.exports = doctorRoute;

