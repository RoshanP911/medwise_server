const express =require ("express")
const userRoute=express.Router()
const { verifyToken } = require("../middlewares/jwt");

const userController=require("../controllers/userController") 


// USER ROUTES BACKEND
userRoute.post('/register', userController.userRegistration) //d
userRoute.post('/otp', userController.verifyOtp) //d
userRoute.post('/resend-otp', userController.resendOtp)//d
userRoute.post('/login',userController.userLogin) //d
userRoute.post('/forgot-password',userController.forgotPassword)//d
userRoute.post('/reset-password/:id/:token',userController.resetPassword)

userRoute.post('/edit-profile',verifyToken,userController.editProfile)
userRoute.get('/find-doctors',userController.findDoctors) //d
userRoute.post('/blockUser', userController.userBlock)
userRoute.get('/singleDoctorDetails/:id',verifyToken, userController.singleDoctorDetails)
userRoute.post('/create-checkout-session',verifyToken, userController.stripeBooking)










module.exports = userRoute;