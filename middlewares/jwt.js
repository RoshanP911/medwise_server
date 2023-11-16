const jwt = require("jsonwebtoken");

//OLD USER TOKEN VALIDATION 
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


// TOKEN VALIDATION
  const verifyToken = (req,res,next) =>{
        const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.json("unauthorized");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.json("unauthorized");
      }
      res.locals.userId = decodedToken._id;
      res.locals.userRole = decodedToken.role;
      next();
    });
  }

 const verifyUser = (role) =>(req, res, next) => {
    verifyToken(req, res, () => {
      if (res.locals.userRole === role) {
        console.log('new user token');
        next();
      } else {
        res.json("unauthorized");
      }
    });
  };












//DOCTOR TOKEN VALIDATION (OLD)
  const validateDoctorToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json("unauthorized");
        }
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
      next();
    });
  } 
  else {
    res.json("unauthorized");
  }
};







 module.exports={validateAdminToken,validateDoctorToken,validateUserToken,verifyToken,verifyUser}
