const express =require ("express")
const userRoute=express.Router()
const {verifyUser} =require("../middlewares/jwt")
const userController=require("../controllers/userController") 
const { checkUserBlock } = require("../middlewares/blockCheck")


// USER ROUTES BACKEND
userRoute.post('/register', userController.userRegistration) //d
userRoute.post('/otp', userController.verifyOtp) //d
userRoute.post('/resend-otp', userController.resendOtp)//d
userRoute.post('/login',userController.userLogin) //d
userRoute.post('/forgot-password',userController.forgotPassword)//d
userRoute.post('/reset-password/:id/:token',userController.resetPassword)
userRoute.get('/find-doctors',userController.findDoctors) //d

userRoute.post('/edit-profile',verifyUser('user'),checkUserBlock,userController.editProfile)
userRoute.get('/singleDoctorDetails/:id',verifyUser('user'), checkUserBlock,userController.singleDoctorDetails)//d
userRoute.post('/create-checkout-session',verifyUser('user'), checkUserBlock,userController.stripeBooking)//d
userRoute.post('/appointments',verifyUser('user'),checkUserBlock, userController.getAppointment)//d
userRoute.post('/cancel-appointment',verifyUser('user'),checkUserBlock, userController.cancelAppointment)//d
userRoute.post('/prescription',verifyUser('user'), checkUserBlock,userController.prescriptions)
userRoute.post('/rating',verifyUser('user'), checkUserBlock,userController.rating)
userRoute.get('/get-rating/:id',verifyUser('user'),checkUserBlock, userController.getRating)
userRoute.post('/get-appointments-cancelled',verifyUser('user'),checkUserBlock, userController.getCancelledAppointments)
userRoute.post('/edit-review',verifyUser('user'),checkUserBlock, userController.editReview)
userRoute.post('/wallet-update',verifyUser('user'),checkUserBlock, userController.walletPayment)
userRoute.post('/fetch-wallet-balance',verifyUser('user'),checkUserBlock, userController.fetchWalletBalance)
userRoute.post('/wallet-payment',verifyUser('user'),checkUserBlock, userController.walletPayment)







module.exports = userRoute;