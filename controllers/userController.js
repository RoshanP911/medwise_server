const User = require("../models/userModel.js");
const Doctor = require("../models/doctorModel.js");
const Appointment = require("../models/appointmentModel.js");
const Review = require("../models/reviewModel.js");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const userRepository = require("../repository/user-repository.js");
require("dotenv").config();

//NEW USER SIGNUP
const userRegistration = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    // const existingUser = await User.findOne({ email: email });
    const existingUser = await userRepository.findUserByEmail(email);

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

        return res.status(200).json({
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
      const newUser = await userRepository.creatNewUser(
        name,
        email,
        hashPassword,
        mobile,
        otp
      );

      if (newUser) {
        await sendMail(email, otp);
        return res.status(200).json({
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
    const user = await User.findById(state);
    if (user) {
      if (user.otp === ootp) {
        const userr = await User.findById(state);
        if (userr) {
          userr.is_verified = true;
          userr.save();
          res.status(201).json({
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
        .json({ message: "User is not registered", success: false });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//OTP RESEND
const resendOtp = async (req, res) => {
  try {
    const { state } = req.body;

    //generate otp
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const user = await User.findById(state);
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

//USER LOGIN
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const isUser = await userRepository.findUserByEmail(email);
      
          if (isUser) {

        if (isUser.is_blocked) {
          return res
            .status(400)
            .json({ message: "Account blocked by admin", success: false });
        }
        
        const passwordsMatch = await bcryptjs.compare(
          password,
          isUser.password
        );
        const verified = isUser.is_verified; //To check if user is verified

        if (passwordsMatch && verified) {
          const token = jwt.sign({ userId: isUser._id, role: isUser.role }, process.env.JWT_SECRET);
          if (!token) {
            return res.status(500).json({ message: "Failed to generate token", success: false });
          }
 

          return res.status(200).json({
            message: "Login Successful",
            token: token,
            success: true,
            isUser,
          });
        } else {
          return res
            .status(400)
            .json({ message: "Invalid Credentials ", success: false });
        }
      } else {
        return res
          .status(400)
          .json({ message: "User is not registered", success: false });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Fill all fields", success: false });
    }
  } catch (error) {
    return res
      .json(500)
      .send({ message: "Something went wrong ", success: false, error });
  }
};

//FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isUser = await User.findOne({ email: email });
    if (isUser) {
      const payload = { userId: isUser._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

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
            text: `https://medwise-client.vercel.app/reset-password/${isUser._id}/${token}`,

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
        .json({ message: "User is not registered", success: false });
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

    jwt.verify(token,process.env.JWT_SECRET, async (err) => {
      if (err) {
        return res.json({ message: "Error with token" });
      } else {
        try {
          const hash = await bcryptjs.hash(newPassword, 10);
          await User.findByIdAndUpdate({ _id: id }, { password: hash });
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

//EDIT PROFILE
const editProfile = async (req, res) => {
  try {
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

    return res.status(200).json({
      message: "Changes saved successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", success: false, error });
  }
};



//FIND DOCTORS
const findDoctors = async (req, res) => {
  try {
    const allDoctors = await Doctor.find({ is_approved: true });
    return res
      .status(200)
      .json({ message: "allDoctors", success: true, allDoctors: allDoctors });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching doctor", success: false, error });
  }
};

const singleDoctorDetails = async (req, res) => {
  try {
    id = req.params.id;
    const doctorDetail = await Doctor.findById({ _id: id });
     if(!doctorDetail){
        res.status(404).send({
        success: false,
        message: "No doctors found",
      });
        }
      res.status(200).send({
        success: true,
        message: "details fetched",
        data: doctorDetail,
      });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching doctor", error });
  }
};

//STRIPE BOOKING NEW
const stripeBooking = async (req, res) => {
  try {
    const { doctor, user, value } = req.body.response;
    const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Dr.${doctor.name}`,
            },
            unit_amount: `${doctor?.videoCallFees * 100}`,
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: `${process.env.DOMAIN}/success`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    if (session) {
      const appointment = new Appointment({
        userId: user._id,
        doctorId: doctor._id,
        slot: value,
        amount_paid: doctor.videoCallFees,
      });
      appointment.save();
    } else {
      res.json({ message: "No session" });
    }
    res.send({ url: session.url });
  } catch (error) {
    res.json("error");
  }
};

const getAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await Appointment.find({ userId: userId })
      .populate("doctorId")
      .populate("userId");
    return res.status(200).json({ success: true, appointments: appointments });
  } catch (error) {
    console.log(error);
  }
};


//CANCEL APPOINTMENT
const cancelAppointment = async (req, res) => {
  try {
    const { apptId } = req.body;
    const newAppt=await Appointment.findByIdAndUpdate(
      { _id: apptId },
      { $set: { isCancelled: true } }
    );

    const userId=newAppt.userId
    const total=Number((newAppt.amount_paid * 60) / 100)


     await User.findByIdAndUpdate(
      userId,
      {
        $inc: { wallet: total } 
      },
      { new: true } 
    );

    return res
      .status(200)
      .json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

const prescriptions = async (req, res) => {
  try {
    const id = req.body.id;
    const data = await Appointment.find({ userId: id })
      .populate("doctorId")
      .populate("userId");
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};


const rating = async (req, res) => {
  try {
    const data = req.body;
    const { review, rating, doctorId, userId, userName } = data;

    // Check if a review already exists for the given doctorId and userId
    const existingReview = await Review.findOne({ doctorId, userId });

    if (existingReview) {
      // Update existing review
      existingReview.feedback = review;
      existingReview.rating = rating;
      existingReview.userName = userName;

      const updatedReview = await existingReview.save();
      res.json(updatedReview);
    } else {
      // Create a new review if it doesn't exist
      const newReview = new Review({
        userId,
        doctorId,
        feedback: review,
        rating,
        userName,
      });

      const savedReview = await newReview.save();
      res.json(savedReview);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const allRatings = await Review.find({ doctorId: id })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("userId")
      .exec();
    if (!allRatings) {
      console.log("No reviews found");
    }
    const result = await Review.find({ doctorId: id });
    if (result.length === 0) return res.json({ allRatings, averageRating: 0 });
    const totalRatings = result.reduce((acc, rating) => acc + rating.rating, 0);
    const averageRating = (totalRatings / result.length).toFixed(1);
    res.status(200).json({ allRatings, averageRating });
  } catch (error) {
    console.log(error);
  }
};


const editReview = async (req, res, next) => {
  try {
    const { userId,doctorId } = req.body

    const allRatings = await Review.find({ doctorId: doctorId,userId:userId })
    res.status(200).json({success: true, allRatings });
  } catch (error) {
    console.log(error);
  }
};

const getCancelledAppointments = async (req, res, next) => {
  try {
    let { userId } = req.body;
    const appointments = await Appointment.find({
      isCancelled: true,
      userId: userId,
    }).populate("doctorId");
    if (!appointments) {
      console.log("No appointments found");
    }
    res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
  }
};


//WALLET
//TO UPDATE WALLET IN USER MODEL
const walletUpdate = async (req, res, next) => {
  try {
    let { userId,total } = req.body;
    const user =  await User.findByIdAndUpdate(userId, {
      wallet:total
        });
    if (!user) {
      console.log("No users found");
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};


//TO GET WALLET BALANCE
const fetchWalletBalance = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user =  await User.findById( userId );
    if (!user) {
      console.log("No users found");
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};



//TO GET WALLET BALANCE
const walletPayment= async (req, res, next) => {
  try {
    const { total,docFees,userId,docId,slot } = req.body;
    if(total<docFees){
      return res.status(200).json({ success: false, message: "Insufficient Balance" });
    }
    else{
      const newTotal=total-docFees
   await User.findByIdAndUpdate(userId, {wallet:newTotal});
   const appointment = new Appointment({
    userId: userId,
    doctorId: docId,
    slot: slot,
    amount_paid: docFees,
  });
  appointment.save();


return res.status(200).json({ success: true });
    }

  } catch (error) {
    console.log(error);
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
  findDoctors,
  singleDoctorDetails,
  stripeBooking,
  getAppointment,
  cancelAppointment,
  prescriptions,
  rating,
  getRating,
  getCancelledAppointments,
  editReview,
  walletUpdate,
  fetchWalletBalance,
  walletPayment

};
