const User = require("../models/userModel.js");
const Doctor = require("../models/doctorModel.js");
const Appointment = require("../models/appointmentModel.js");


const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
//const stripe = stripePackage(`${process.env.STRIPE_KEY}`);
require("dotenv").config();

//NEW USER SIGNUP



const userRegistration = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    console.log(existingUser, 'existingUser');
    if (existingUser) {
      if (existingUser.is_verified) {
        res
          .status(200)
          .json({ message: "User or email already exists", success: false });
      } else {
        // Generate OTP
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // To hash password
        const hashPassword = await bcryptjs.hash(password, 10);

        // Update existing user
        await User.findByIdAndUpdate(existingUser._id, {
          name: name,
          password: hashPassword,
          mobile: mobile,
          otp: otp,
        });

        await sendMail(email, otp);

        console.log(existingUser, 'updatedUser');
        return res
          .status(200)
          .json({ user: existingUser, message: "Please check your mail for OTP", success: true });
      }
    } else {
      // Generate OTP
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

      // To hash password
      const hashPassword = await bcryptjs.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
        name: name,
        email: email,
        password: hashPassword,
        mobile: mobile,
        otp: otp,
      });

      if (newUser) {
        await sendMail(email, otp);

        console.log(newUser, 'newUser');
        return res
          .status(200)
          .json({ user: newUser, message: "Please check your mail for OTP", success: true });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


//USER OTP SEND VIA EMAIL
const sendMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailoption = {
      from: "roshanprashanth@gmail.com",
      to: email,
      subject: " OTP Verification mail",
      text: `hello your otp is ${otp}`,
    };

    transporter.sendMail(mailoption, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email has been sent", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//USER OTP VERIFY
const verifyOtp = async (req, res) => {
  try {
    const { ootp, state } = req.body;
    console.log(req.body,'reqbody verify otpp');
    const user = await User.findById(state);
    if (user) {
      if (user.otp===ootp) {
            const userr=await User.findById(state)
            if(userr){
              userr.is_verified=true
              userr.save()
              console.log(user,'user from otp verfy');
              res.status(201).json({ message: "OTP verified successfully", success: true,userData:user });
            }

      } else {
        res.status(200).json({message:"Incorrect otp", success: false});
      }
    } else {
      return res.status(200).json({message:"User is not registered", success: false});
    }
  } catch (error) {
    console.log(error,'errorrrrrr');
    return res.status(400).json({ message: error.message });
  }
};

//OTP RESEND
const resendOtp=async(req,res)=>{
  try {
    const { state } = req.body;

     //generate otp
     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
     const user = await User.findById(state);
     if(user){
      await sendMail(user.email, otp);
      user.otp=otp
      user.save()
      res.json({ userid: user._id, message: "Please check your mail for OTP" ,success:true});
     }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

//USER LOGIN
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (email && password) {
      const isUser = await User.findOne({ email: email });
      if (isUser) {
        const passwordsMatch=await bcryptjs.compare(password, isUser.password)
        const verified=isUser.is_verified         //To check if user is verified

        if (passwordsMatch && verified) {
          const payload = { userId: isUser._id }; 
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
    
          return res.status(200).json({ message: "Login Successful", token: token,success: true, isUser});
        } else {
          return res.status(400).json({message:"Invalid Credentials ", success: false });
        }
      } else {
        return res.status(400).json({message:"User is not registered", success: false});
      }
    } else {
      return res.status(400).json({ message: "Fill all fields", success: false });
    }
  } catch (error) {
    return res.json(500).send({ message: "Something went wrong ", success: false, error });
  }
};

//FORGOT PASSWORD
const forgotPassword=async(req,res)=>{
try {
  const {email}=req.body
  const isUser=await User.findOne({email:email})

  if(isUser){

    const payload = { userId: isUser._id }; 
          const token = jwt.sign(payload, "secreTkey", { expiresIn: "2h" });

          const sendMail = async (email,token) => {
            try {
              const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                },
              });
          
              const mailoption = {
                from: "roshanprashanth@gmail.com",
                to: email,
                subject: "Reset password link",
                text: `http://localhost:3000/reset-password/${isUser._id}/${token}`,
              };
          
              transporter.sendMail(mailoption, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  return res.status(200).json({message:"Email has been sent", success: true});
                }
              });
            } catch (error) {
              console.log(error.message);
            }
          };
          await sendMail(isUser.email,token);
  }else{
    return res.status(200).json({message:"User is not registered", success: false});
  }
} catch (error) {
  return res.json(500).send({ message: "something went wrong ", success: false, error });
}
}


//RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    console.log(req.body, 'req body');
    console.log(req.params, 'req params');

    const { id, token } = req.params;
    const newPassword = req.body.password; 

    jwt.verify(token, 'secreTkey', async (err, decoded) => {
      if (err) {
        return res.json({ message: "Error with token" });
      } else {
        try {
          const hash = await bcryptjs.hash(newPassword, 10);
          await User.findByIdAndUpdate({ _id: id }, { password: hash });
          return res.status(200).json({message:"Password reset successful ", success: true });
        } catch (error) {
          res.status(500).json({ message: 'Something went wrong', success: false, error });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', success: false, error });
  }
};


//EDIT PROFILE
const editProfile = async (req, res) => {
  try {
    console.log(req.body, 'reqbodyy edit profilew');
    const userData = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userData.userId },
      {
        $set: {
          name: userData.name,
          mobile: userData.mobile,
          gender: userData.gender,
          email: userData.email,
          age: userData.age,
          address: userData.address,
          image: userData.imageUrl,

        },
      },
      { new: true } 
    );


    return res
      .status(200)
      .json({ message: 'Changes saved successfully', success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', success: false, error });
  }
};




 //USER BLOCK/UNBLOCK
 const userBlock=async(req,res)=>{

  const {userId}=req.body
  console.log(userId,'userId');

  const blockUserData=await User.findById(userId)
console.log(blockUserData,'blockUserDatablockUserData');
}




//FIND DOCTORS
const findDoctors= async (req, res) => {
  try {
    const allDoctors = await Doctor.find({ is_approved:true });
    return res
    .status(200)
    .json({ message: 'allDoctors', success: true, allDoctors:allDoctors });


  } catch (error) {
    res.status(500).json({ message: "Error while fetching doctor", success: false, error });
  }
}


//
const singleDoctorDetails=async (req, res) => {
  try {
    id = req.params.id;
      const doctorDetail = await Doctor.findById({ _id: id });
      console.log(doctorDetail,'doctorDetail');

      if (doctorDetail) {
        res.status(200).send({
          success: true,
          message: "details fetched",
          data: doctorDetail,
          
        });
      } else {
        res.status(404).send({
          success: false,
          message: "error while fetching doctor details",
        });
      }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching doctor", success: false, error });
  }
}



const bookSlot = async (req, res) => {
  try {

    const { doctor, user, value} = req.body;
    const appointmentData=req.body

    const appointment = new Appointment({
      userId:user._id,
      doctorId:doctor._id,
      slot:value
    });
    appointment.save();


    res.status(200).send({
      success: true,
      appointmentData,
      message: "Appointment created"
      
    });
  } catch (error) {
    res.json("error");
  }
};




const stripeBooking = async (req, res) => {
  try {
const doctorData=req.body.response.doctor



// This is your test secret API key.
const stripe = require('stripe')('sk_test_51NyySbSIIYrigBg1ibHYBEz6XBMk9xh6qb4nz7vIqEsBr92K5a2ADUGRp1yenIZ2C9HnAF2sbRckGoDygVH33mKC00lAfwi36J');
const express = require('express');
const app = express();
app.use(express.static('public'));


  const session = await stripe.checkout.sessions.create({

    line_items: [
            {
              price_data: {
                currency: "inr",
                product_data: {
                  name: `Dr.${doctorData.name}`,
                },
                unit_amount: `${doctorData?.videoCallFees * 100}`,
              },
              quantity: 1,
            },
          ],

    mode: 'payment',
    success_url: `${process.env.DOMAIN}/success`,
    cancel_url: `${process.env.DOMAIN}/cancel`,
  });

  res.send({ url: session.url });



  } catch (error) {
    res.json("error");
  }
};



















module.exports = {
  userRegistration,
  sendMail,
  verifyOtp,
  resendOtp,
  userLogin,
  forgotPassword,
  resetPassword,
  editProfile,
  userBlock,
  findDoctors,
  singleDoctorDetails,
  bookSlot,
  stripeBooking
};
