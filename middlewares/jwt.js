const jwt = require("jsonwebtoken");

//USER TOKEN VALIDATION 
  const validateUserToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    // console.log(authHeader,'authHeader from validateUserToken');
    if(authHeader){
      const token=authHeader.split(" ")[1]
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json("unauthorized");
        }
        // console.log('successs from validateUserToken');
        next();
      });
    } else {
      res.json("unauthorized");
    }
  }

//DOCTOR TOKEN VALIDATION 
  const validateDoctorToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(authHeader,'authHeader from validateDoctorToken');
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json("unauthorized");
        }
        // console.log('successs from validateDocToken');
        next();
      });
    } else {
      res.json("unauthorized");
    }
  };





//ADMIN TOKEN VALIDATION     TO validate the access token provided in the Authorization header of an incoming HTTP request.
const validateAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json("unauthorized");
      }
      // console.log('successs from validateAdminToken');
      next();
    });
  } 
  else {
    res.json("unauthorized");
  }
};








 module.exports={validateAdminToken,validateDoctorToken,validateUserToken}

