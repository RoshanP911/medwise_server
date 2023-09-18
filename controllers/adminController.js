const Admin =require("../models/adminModel")
const User = require("../models/userModel.js");
const Department=require('../models/departmentModel')
const Doctor=require('../models/doctorModel')
const jwt = require("jsonwebtoken");
const fs = require('fs');
const cloudinary = require('cloudinary').v2

require("dotenv").config();

//CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});


const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Fill all fields", success: false });
      }
  
      const isUser = await Admin.findOne({ email: email });
  
      if (!isUser) {
        return res.status(401).json({ message: "User is not registered", success: false });
      }
  
      if (isUser.password === password) {
        const payload = { userId: isUser._id };
        const token = jwt.sign(payload, "secreTkey", { expiresIn: "2h" });
  
        return res.status(200).json({ message: "Login Successful", token: token, success: true, isUser });
      } else {
        return res.status(200).json({ message: "Invalid Credentials", success: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", success: false, error });
    }
  };


//USERS LIST
  const userList=async(req,res)=>{
    try {
      const userData = await User.find();
      return res.status(200).json({ message: "user list is here",  success: true, userData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", success: false, error });
    }
  }


  //DEPARTMENT LIST
  const departmentList=async(req,res)=>{
    try {
      const departmentData = await Department.find();
      return res.status(200).json({ message: "Department list is here",  success: true, departmentData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", success: false, error });
    }
  }

  
  //DOCTOR LIST
  const doctorList=async(req,res)=>{
    try {
      const doctorData = await Doctor.find();
      return res.status(200).json({ message: "Department list is here",  success: true, doctorData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", success: false, error });
    }
  }


  //CREATE DEPARTMENT
  const createDepartment = async (req, res) => {
    try {
      const { departmentName,imageUrl } = req.body;
      console.log(req.body,'req.body createDepartment ');

      const exist = await Department.find({ name: departmentName });
      if(exist!= ""){
        return res.status(200).json({ message: "Department already exists",  success: true});
      }
      else{
      const dep = new Department({
        name: departmentName,
        image:imageUrl
      });

      const depData = await dep.save();
      return res.status(200).json({ message: "Department created successfully",  success: true});
    }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", success: false});
    }
  }



  //DOCTOR BLOCK/UNBLOCK

  const doctorBlockUnblock=async(req,res)=>{

    const {doctorId}=req.body

    const blockUserData=await Doctor.findById(doctorId)
    const block_status = blockUserData.is_blocked

    try {
      const blockDoctor=await Doctor.findByIdAndUpdate(
        doctorId,
        { $set: { is_blocked: !block_status } },
        { new: true }
      );
    

          if(blockDoctor.is_blocked===true){
            return res.status(200).json({message:'Doctor blocked successfully',success: true ,data:blockDoctor})
            }
            else{
              return res.status(200).json({message:'Doctor unblocked successfully',success: true ,data:blockDoctor})
            }
      

    } catch (error) {
      console.error(error);

      return res.status(500).json({ message: "Error while blocking doctor", success: false,error: error.message});
    }
  }


module.exports={
adminLogin,
userList,
createDepartment,
departmentList,
doctorList,
doctorBlockUnblock
}