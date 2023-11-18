import User from '../models/userModel.js'
import Doctor from '../models/doctorModel.js'

export const checkUserBlock = async (req, res, next) => {

  try {

      let user;
      if (localStorage.getItem('usertoken')) {
        user = await User.findById();
      } else if (localStorage.getItem('doctortoken')) {
        user = await Doctor.findById();
      }
      
      if (user && user.is_blocked) {
        return res.status(403).json({ message: "You are blocked" });
      }

      next();

  } catch (error) {
    next(error);
  }
};