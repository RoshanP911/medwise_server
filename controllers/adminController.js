const Admin = require("../models/adminModel");
const User = require("../models/userModel.js");
const Department = require("../models/departmentModel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel.js");

const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

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
      return res
        .status(400)
        .json({ message: "Fill all fields", success: false });
    }
    const isUser = await Admin.findOne({ email: email });

    if (!isUser) {
      return res
        .status(401)
        .json({ message: "Admin is not registered", success: false });
    }

    if (isUser.password === password) {
      const token = jwt.sign(
        { userId: isUser._id, role: isUser.role },
        process.env.JWT_SECRET
      );

      return res
        .status(200)
        .json({
          message: "Login Successful",
          token: token,
          success: true,
          isUser,
        });
    } else {
      return res
        .status(200)
        .json({ message: "Invalid Credentials", success: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//USERS LIST
const userList = async (req, res) => {
  try {
    const userData = await User.find();
    return res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//DEPARTMENT LIST
const departmentList = async (req, res) => {
  try {
    const departmentData = await Department.find();
    return res.status(200).json({ success: true, departmentData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//DOCTOR LIST
const doctorList = async (req, res) => {
  try {
    const doctorData = await Doctor.find();
    return res
      .status(200)
      .json({ message: "Department list is here", success: true, doctorData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//CREATE DEPARTMENT
const createDepartment = async (req, res) => {
  try {
    const { departmentName, imageUrl } = req.body;
    const nameLo = departmentName.toLowerCase();

    const exist = await Department.find({ name: nameLo });
    if (exist != "") {
      return res
        .status(200)
        .json({ message: "Department already exists", success: true });
    } else {
      const dep = new Department({
        name: nameLo,
        image: imageUrl,
      });
      await dep.save();
      return res
        .status(200)
        .json({ message: "Department created successfully", success: true });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

//USER BLOCK/UNBLOCK
const userBlockUnblock = async (req, res) => {
  const { Id } = req.body;
  const blockUserData = await User.findById(Id);
  const block_status = blockUserData.is_blocked;

  try {
    const blockUser = await User.findByIdAndUpdate(
      Id,
      { $set: { is_blocked: !block_status } },
      { new: true }
    );

    if (blockUser.is_blocked === true) {
      return res
        .status(200)
        .json({
          message: "User blocked successfully",
          success: true,
          data: blockUser,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "User unblocked successfully",
          success: true,
          data: blockUser,
        });
    }
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        message: "Error while blocking User",
        success: false,
        error: error.message,
      });
  }

};

//DOCTOR BLOCK/UNBLOCK

const doctorBlockUnblock = async (req, res) => {
  const { Id } = req.body;

  const blockUserData = await Doctor.findById(Id);
  const block_status = blockUserData.is_blocked;

  try {
    const blockDoctor = await Doctor.findByIdAndUpdate(
      Id,
      { $set: { is_blocked: !block_status } },
      { new: true }
    );

    if (blockDoctor.is_blocked === true) {
      return res
        .status(200)
        .json({
          message: "Doctor blocked successfully",
          success: true,
          data: blockDoctor,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Doctor unblocked successfully",
          success: true,
          data: blockDoctor,
        });
    }
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        message: "Error while blocking doctor",
        success: false,
        error: error.message,
      });
  }
};

//DOCTOR APPROVE
const doctorApprove = async (req, res) => {
  const { Id } = req.body;

  const approveDoctorData = await Doctor.findById(Id);
  const approve_status = approveDoctorData.is_approved;

  try {
    const approveDoctor = await Doctor.findByIdAndUpdate(
      Id,
      { $set: { is_approved: !approve_status } },
      { new: true }
    );

    if (approveDoctor.is_approved === true) {
      return res
        .status(200)
        .json({
          message: "Doctor approved successfully",
          success: true,
          data: approveDoctor,
        });
    } else {
      return res
        .status(200)
        .json({
          message: "Doctor not approved",
          success: true,
          data: approveDoctor,
        });
    }
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        message: "Error while approving doctor",
        success: false,
        error: error.message,
      });
  }
};

const docDocument = async (req, res) => {
  const { Id } = req.body;
  const DoctorData = await Doctor.findById(Id);
  try {
    return res
      .status(200)
      .json({
        message: "Doctor got successfully",
        success: true,
        data: DoctorData.file,
      });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        message: "Error while getting doctor",
        success: false,
        error: error.message,
      });
  }
};

const docDetails = async (req, res) => {
  const { approveUserId } = req.body;
  const DoctorData = await Doctor.findById(approveUserId);
  try {
    return res.status(200).json({ data: DoctorData });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({
        message: "Error while getting doctor",
        success: false,
        error: error.message,
      });
  }
};

const allBookings = async (req, res, next) => {
  try {
    const bookings = await Appointment.find()
      .sort({ createdAt: -1 })
      .populate("userId")
      .populate("doctorId")
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Internal server error",
        success: false,
        error: error.message,
      });
    
  }
};


const userCount = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    if (!userCount) return res
    .status(500)
    .json({
      message: "No users found",
      success: false,
      error: error.message,
    });
    res.status(200).json(userCount);
  } catch (error) {
    next(error);
  }
};


const doctorCount = async (req, res, next) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (!doctorCount) return res
      .status(500)
      .json({
        message: "No doctors found",
        success: false,
        error: error.message,
      });
    res.status(200).json(doctorCount);
  } catch (error) {
    next(error);
  }
};

const totalRevenue = async (req, res, next) => {
  try {
    const adminId=process.env.ADMIN

    const admin = await Admin.findById(adminId);

          if (!admin) return res
      .status(404)
      .json({
        message: "Admin not found",
        success: false,
      });

      const amount=admin.payments
    res.status(200).json(amount);


  } catch (error) {
    console.log(error);

  }
};

const apptStatusCount = async (req, res, next) => {
  try {
     const apptCount = await Appointment.countDocuments();
const apptStatusCount = await Appointment.aggregate([
  {
    $group: {
      _id: null,
      cancelledCount: { $sum: { $cond: [{ $eq: ["$isCancelled", true] }, 1, 0] } },
      attendedCount: { $sum: { $cond: [{ $eq: ["$isAttended", true] }, 1, 0] } }
    }
  },
  {
    $project: {
      _id: 0,
      totalCancelledCount: "$cancelledCount",
      totalAttendedCount: "$attendedCount",
      total: { $add: ["$cancelledCount", "$attendedCount"] }
    }
  }
]);
    const { totalCancelledCount, totalAttendedCount, total } = apptStatusCount[0];
const totalConfirmedCount=apptCount-total
    res.status(200).json({ totalCancelledCount,totalAttendedCount,totalConfirmedCount });
  } catch (error) {

    console.log(error);
  }
};

module.exports = {
  adminLogin,
  userList,
  createDepartment,
  departmentList,
  doctorList,
  doctorBlockUnblock,
  userBlockUnblock,
  doctorApprove,
  docDocument,
  docDetails,
  allBookings,
  userCount,
  doctorCount,
  totalRevenue,
  apptStatusCount


};
