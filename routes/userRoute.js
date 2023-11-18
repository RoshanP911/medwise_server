const express =require ("express")
const userRoute=express.Router()
const {verifyUser} =require("../middlewares/jwt")
const userController=require("../controllers/userController") 


// USER ROUTES BACKEND
userRoute.post('/register', userController.userRegistration) //d
userRoute.post('/otp', userController.verifyOtp) //d
userRoute.post('/resend-otp', userController.resendOtp)//d
userRoute.post('/login',userController.userLogin) //d
userRoute.post('/forgot-password',userController.forgotPassword)//d
userRoute.post('/reset-password/:id/:token',userController.resetPassword)

userRoute.post('/edit-profile',verifyUser('user'),userController.editProfile)

userRoute.get('/find-doctors',userController.findDoctors) //d
userRoute.post('/blockUser', userController.userBlock)
userRoute.get('/singleDoctorDetails/:id',verifyUser('user'), userController.singleDoctorDetails)//d
userRoute.post('/create-checkout-session',verifyUser('user'), userController.stripeBooking)//d
userRoute.post('/appointments',verifyUser('user'), userController.getAppointment)//d
userRoute.post('/cancel-appointment',verifyUser('user'), userController.cancelAppointment)//d
userRoute.post('/prescription',verifyUser('user'), userController.prescriptions)
userRoute.post('/rating',verifyUser('user'), userController.rating)
userRoute.get('/get-rating/:id',verifyUser('user'), userController.getRating)
userRoute.post('/get-appointments-completed',verifyUser('user'), userController.getCompletedAppointments)





module.exports = userRoute;