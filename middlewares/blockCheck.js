const User = require("../models/userModel.js");
const Doctor = require("../models/doctorModel");

const checkUserBlock = async (req, res, next) => {
  try {
    let user;
    if (res.locals.userRole === 'user') {
      user = await User.findById(res.locals.userId);
    } else if (res.locals.userRole === 'doctor') {
      user = await Doctor.findById(res.locals.userId);
    }
    if (user && user.is_blocked) {
      return res.status(403).json({ message: "You are blocked", success: false });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { checkUserBlock };



