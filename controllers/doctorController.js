const Doctor = require("../models/doctorModel.js");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//NEW DOCTOR SIGNUP
const doctorRegistration = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    const existingUser = await Doctor.findOne({ email: email });
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
        await Doctor.findByIdAndUpdate(existingUser._id, {
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
      const newUser = await Doctor.create({
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
        text: `Hello, your OTP is ${otp}`,
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
      const user = await Doctor.findById(state);
      if (user) {
        if (user.otp===ootp) {
              const userr=await Doctor.findById(state)
              if(userr){
                userr.is_verified=true
                userr.save()
                res.status(201).json({ message: "OTP verified successfully", success: true,userData:user });
              }  
        } else {
          res.status(200).json({message:"Incorrect otp", success: false});
        }
      } else {
        return res.status(200).json({message:"Doctor is not registered", success: false});
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
       const user = await Doctor.findById(state);
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


  //DOCTOR LOGIN
const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const isUserr = await Doctor.findOne({ email: email });
      if (isUserr) {
        const passwordsMatch= bcryptjs.compare(password, isUserr.password)
        const verified=isUserr.is_verified  
      


        if (passwordsMatch && verified) { 
           const approved=isUserr.is_approved  
          if(approved){
                 const payload = { userId: isUserr._id };
          const token = jwt.sign(payload, "secreTkey", { expiresIn: "2h" });
          return res.status(200).json({ message: "Login Successful", token: token,success: true, isUserr});
          }
          else{
            return res.status(200).json({message:"Account not approved by admin", success: false,isUserr });
          }
     
        } else {
          return res.status(400).json({message:"Invalid Credentials", success: false });
        }
      } else {
        return res.status(400).json({message:"Doctor is not registered", success: false});
      }
    } else {
      return res.status(400).json({ message: "Fill all fields", success: false });
    }
  } catch (error) {
    return res.status(500).send({ message: "something went wrong ", success: false, error });
  }
};




//FORGOT PASSWORD
const forgotPassword=async(req,res)=>{
  try {
    const {email}=req.body
    const isUser=await Doctor.findOne({email:email})
  
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
                  text: `http://localhost:3000/doctor/reset-password/${isUser._id}/${token}`,
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
      return res.status(200).json({message:"Doctor is not registered", success: false});
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
          await Doctor.findByIdAndUpdate({ _id: id }, { password: hash });
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




const doctorDetails = async (req, res) => {
  try {
    console.log(req.body, 'req body doctorDetails');
    const {doccData,registrationNumber,registrationCouncil,registrationYear, qualification,videoCallFees,specialisation,city,gender,fileUrl}=req.body

    await Doctor.findByIdAndUpdate({_id:doccData}, { registrationNumber:registrationNumber, registrationCouncil:registrationCouncil,registrationYear:registrationYear,qualification:qualification,videoCallFees:videoCallFees,specialisation:specialisation,city:city,gender:gender,file:fileUrl})
    return res.status(200).json({message:"Doctor registration completed ", success: true });







  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', success: false, error });
  }
};

  
module.exports = {
    doctorRegistration,
    sendMail,
    verifyOtp,
    resendOtp,
    doctorLogin,
    forgotPassword,
    resetPassword,
    doctorDetails
  };
  