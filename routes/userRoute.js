const express =require ("express")
const userRoute=express.Router()
const {validateUserToken} =require("../middlewares/jwt")

const userController=require("../controllers/userController") 


// USER ROUTES BACKEND
userRoute.post('/register', userController.userRegistration) //d
userRoute.post('/otp', userController.verifyOtp) //d
userRoute.post('/resend-otp', userController.resendOtp)//d
userRoute.post('/login',userController.userLogin) //d
userRoute.post('/forgot-password',userController.forgotPassword)//d
userRoute.post('/reset-password/:id/:token',userController.resetPassword)

userRoute.post('/edit-profile',validateUserToken,userController.editProfile)
userRoute.get('/find-doctors',userController.findDoctors) //d
userRoute.post('/blockUser', userController.userBlock)
userRoute.get('/singleDoctorDetails/:id',validateUserToken, userController.singleDoctorDetails)//d
userRoute.post('/create-checkout-session',validateUserToken, userController.stripeBooking)//d
userRoute.post('/appointments',validateUserToken, userController.getAppointment)//d
userRoute.post('/cancel-appointment',validateUserToken, userController.cancelAppointment)//d
userRoute.post('/prescription',validateUserToken, userController.prescriptions)
userRoute.post('/rating',validateUserToken, userController.rating)
userRoute.get('/get-rating/:id',validateUserToken, userController.getRating)
userRoute.post('/get-appointments-completed',validateUserToken, userController.getCompletedAppointments)




module.exports = userRoute;