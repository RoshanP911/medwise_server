const Doctor = require("../models/doctorModel.js");
const Appointment = require("../models/appointmentModel.js");
const Department = require("../models/departmentModel.js");
const Review = require("../models/reviewModel.js");

const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//NEW DOCTOR SIGNUP
const doctorRegistration = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    const existingUser = await Doctor.findOne({ email: email });
    console.log(existingUser, "existingUser");
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

        console.log(existingUser, "updatedUser");
        return res
          .status(200)
          .json({
            user: existingUser,
            message: "Please check your mail for OTP",
            success: true,
          });
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

        console.log(newUser, "newUser");
        return res
          .status(200)
          .json({
            user: newUser,
            message: "Please check your mail for OTP",
            success: true,
          });
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
      if (user.otp === ootp) {
        const userr = await Doctor.findById(state);
        if (userr) {
          userr.is_verified = true;
          userr.save();
          res
            .status(201)
            .json({
              message: "OTP verified successfully",
              success: true,
              userData: user,
            });
        }
      } else {
        res.status(200).json({ message: "Incorrect otp", success: false });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Doctor is not registered", success: false });
    }
  } catch (error) {
    console.log(error, "errorrrrrr");
    return res.status(400).json({ message: error.message });
  }
};

//OTP RESEND
const resendOtp = async (req, res) => {
  try {
    const { state } = req.body;

    //generate otp
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const user = await Doctor.findById(state);
    if (user) {
      await sendMail(user.email, otp);
      user.otp = otp;
      user.save();
      res.json({
        userid: user._id,
        message: "Please check your mail for OTP",
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//DOCTOR LOGIN

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res
        .status(400)
        .json({ message: "Doctor is not registered", success: false });
    }

    const passwordsMatch = await bcryptjs.compare(password, doctor.password);

    if (!passwordsMatch) {
      return res
        .status(400)
        .json({ message: "Invalid Credentials", success: false });
    }

    if (!doctor.is_verified) {
      return res
        .status(400)
        .json({ message: "Email not verified", success: false });
    }

    if (!doctor.is_approved) {
      return res
        .status(200)
        .json({
          message: "Account not approved by admin",
          success: true,
          doctor,
        });
    }

    if (doctor.is_blocked) {
      return res
        .status(400)
        .json({ message: "Account blocked by admin", success: false });
    }
    const token = jwt.sign({userId: doctor._id, role: doctor.role }, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ message: "Login Successful", token, success: true, doctor });
  } catch (error) {
    console.error("An error occurred:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isUser = await Doctor.findOne({ email: email });

    if (isUser) {
      const payload = { userId: isUser._id };
      const token = jwt.sign(payload, "secreTkey", { expiresIn: "2h" });

      const sendMail = async (email, token) => {
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
              return res
                .status(200)
                .json({ message: "Email has been sent", success: true });
            }
          });
        } catch (error) {
          console.log(error.message);
        }
      };
      await sendMail(isUser.email, token);
    } else {
      return res
        .status(200)
        .json({ message: "Doctor is not registered", success: false });
    }
  } catch (error) {
    return res
      .json(500)
      .send({ message: "something went wrong ", success: false, error });
  }
};

//RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const newPassword = req.body.password;

    jwt.verify(token, "secreTkey", async (err, decoded) => {
      if (err) {
        return res.json({ message: "Error with token" });
      } else {
        try {
          const hash = await bcryptjs.hash(newPassword, 10);
          await Doctor.findByIdAndUpdate({ _id: id }, { password: hash });
          return res
            .status(200)
            .json({ message: "Password reset successful ", success: true });
        } catch (error) {
          res
            .status(500)
            .json({ message: "Something went wrong", success: false, error });
        }
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//DOCTOR DETAILS
const doctorDetails = async (req, res) => {
  try {
    const {
      doccData,
      registrationNumber,
      registrationCouncil,
      registrationYear,
      qualification,
      videoCallFees,
      specialisation,
      city,
      gender,
      fileUrl,
    } = req.body;

    await Doctor.findByIdAndUpdate(
      { _id: doccData },
      {
        registrationNumber: registrationNumber,
        registrationCouncil: registrationCouncil,
        registrationYear: registrationYear,
        qualification: qualification,
        videoCallFees: videoCallFees,
        specialisation: specialisation,
        city: city,
        gender: gender,
        file: fileUrl,
      }
    );
    return res
      .status(200)
      .json({ message: "Doctor registration completed ", success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//GET SPECILAISATIONS
const getSpecialisations = async (req, res) => {
  try {
    const departmentData = await Department.find();
    const departmentNames = departmentData.map((department) => department.name);
    return res.status(200).json({ success: true, departmentNames });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

//ADD SLOT
const addSlot = async (req, res) => {
  const { doctorData, selectedDate, _id } = req.body;

  try {
    const doctor = await Doctor.findById(doctorData._id);
    if (!doctor) {
      return res
        .status(200)
        .json({ message: "Doctor not found ", success: true });
    }
    if (!doctor.is_verified)
      return res
        .status(200)
        .json({ message: "Doctor not verified ", success: true });

    if (doctor.availableSlots.includes(selectedDate)) {
      return res
        .status(200)
        .json({ message: "Slot already exists ", success: false });
    }

    doctor.availableSlots.push(selectedDate);
    const newDoctor = await doctor.save();
    return res
      .status(200)
      .json({ message: "Slot added successfully ", success: true, newDoctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//DELETE SLOT
const deleteSlot = async (req, res) => {
  const { doctorData, slotToDelete } = req.body;

  try {
    const doctor = await Doctor.findById(doctorData._id);

    if (!doctor) {
      return res
        .status(200)
        .json({ message: "Doctor not found ", success: true });
    }
    doctor.availableSlots = doctor.availableSlots.filter(
      (slot) => slot !== slotToDelete
    );
    const updatedDoctor = await doctor.save();

    return res
      .status(200)
      .json({
        message: "Slot removed successfully ",
        success: true,
        updatedDoctor,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};

//GETTING DOC APPOINTMENT
const getDocAppointment = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const appointments = await Appointment.find({ doctorId: doctorId })
      .populate("doctorId")
      .populate("userId");
    return res.status(200).json({ success: true, appointments: appointments });
  } catch (error) {
    console.log(error);
  }
};

const cancelDocAppointment = async (req, res) => {
  try {
    const { apptId } = req.body;
    await Appointment.findByIdAndUpdate(
      { _id: apptId },
      { $set: { isCancelled: true } }
    );
    return res
      .status(200)
      .json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const endAppointment = async (req, res) => {
  try {
    const appId = req.params.appId;
    await Appointment.findOneAndUpdate({ _id: appId }, { isAttended: true });
    res.json("success");
  } catch (error) {
    console.log(error);
  }
};

//ADD PRESCRIPTION
const addPrescription = async (req, res) => {
  try {
    const data = req.body.payload;
    const id = req.body.id;
    const update = await Appointment.findOneAndUpdate(
      { _id: id },
      { medicines: data },
      { new: true }
    );
    res.json("done");
  } catch (error) {
    console.log(error);
  }
};

//DOCTOR REVIEWS
const doctorReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ doctorId: id })
      .sort({ createdAt: -1 })
      .populate("userId")
      .exec();
    if (!reviews) {
      console.log("no reviews");
    }
    res.status(200).json(reviews);
  } catch (error) {
    // return next(createError(500, "Internal server error"));
    console.log(error,'error');
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
  doctorDetails,
  getSpecialisations,
  addSlot,
  deleteSlot,
  getDocAppointment,
  cancelDocAppointment,
  endAppointment,
  addPrescription,
  doctorReviews,
};
