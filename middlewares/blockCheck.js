// const User = require("../models/userModel.js");
// const Doctor = require("../models/doctorModel");

// const checkUserBlock = async (req, res, next) => {
//   try {
//     let user;
//     if (res.locals.userRole === 'user') {
//       // console.log(res.locals.userRole,'res.locals.userRole');
//       // console.log(res.locals.userId,'res.locals.userId');
//       user = await User.findById(res.locals.userId);

//     } else if (res.locals.userRole === 'doctor') {
//       user = await Doctor.findById(res.locals.userId);
//     }
//     if (user && user.is_blocked) {
//       // console.log(user,'userrrrrrrr blockcheckk');
//       // console.log(user.is_blocked,'user.is_blocked');
//       // console.log('ivde ethiii');
//       localStorage.removeItem("token");
//       navigate("/");
//       return res.status(403).json({ message: "You are blocked" ,success: false});
//     }
//     next();

// } catch (error) {
//   next(error);
// }
// };


// module.exports={checkUserBlock}






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



