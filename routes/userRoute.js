const express =require ("express")
const userRoute=express.Router()
const verifyToken=require("../middlewares/jwt")
const userController=require("../controllers/userController") 


// USER ROUTES BACKEND
userRoute.post('/register', userController.userRegistration)
userRoute.post('/otp', userController.verifyOtp)
userRoute.post('/resend-otp', userController.resendOtp)
userRoute.post('/login',userController.userLogin)
userRoute.post('/forgot-password',userController.forgotPassword)
userRoute.post('/reset-password/:id/:token',userController.resetPassword)

userRoute.post('/edit-profile',verifyToken.verifyToken,userController.editProfile)
userRoute.get('/find-doctors',userController.findDoctors)
userRoute.post('/blockUser', userController.userBlock)
userRoute.get('/singleDoctorDetails/:id', userController.singleDoctorDetails)







module.exports = userRoute;