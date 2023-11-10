const Model = require("../models/userModel.js");


module.exports = {
    findUserByEmail : async (email) => {
        return await Model.findOne({email:email})
    },

    creatNewUser : async (name,email,password,mobile,otp) => {
        return await Model.create({name,email,password,mobile,otp}) 
    },

    
}
