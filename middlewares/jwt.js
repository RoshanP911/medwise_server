const jwt = require("jsonwebtoken");

//USER TOKEN VALIDATION 
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
  
//   console.log(authHeader,'authHeader from verifyToken');

//     if (!token) {
//         console.log('no token');
//         return res
//         .status(200)
//         .json({ message: 'Authentication token not present', success: false});
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//       if (err) {
//         console.log(err,'errrrrrrrrrrrrr');
//         return
//       }

//     console.log('successs');
//       next();
//     });
//   };



  // const verifyToken = (req, res, next) => {
  //   const token = req.headers.authorization?.split(" ")[1];
  //   if (!token) {
  //       console.log('no token');
  //       return res
  //       .status(200)
  //       .json({ message: 'Authentication token not present', success: false});
  //   }
  //   jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
  //     if (err) {
  //       console.log(err,'errrrrrrrrrrrrr');
  //       return
  //     }

  //   console.log('successs');
  //     next();
  //   });
  // };



  const validateUserToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    console.log(authHeader,'authHeader from validateUserToken');
    if(authHeader){
      const token=authHeader.split(" ")[1]
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json("unauthorized");
        }
        console.log('successs from validateUserToken');
        next();
      });
    } else {
      res.json("unauthorized");
    }
  }

//DOCTOR TOKEN VALIDATION 
  const validateDoctorToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader,'authHeader from validateDoctorToken');
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.json("unauthorized");
        }
        console.log('successs from validateDocToken');
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
      console.log('successs from validateAdminToken');
      next();
    });
  } 
  else {
    res.json("unauthorized");
  }
};








 module.exports={validateAdminToken,validateDoctorToken,validateUserToken}

