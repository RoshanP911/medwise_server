const jwt = require("jsonwebtoken");

// TOKEN VALIDATION
  const verifyToken = (req,res,next) =>{
        const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.json("unauthorized");
      // console.log('no token from token validation jwt');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      // console.log('token preswnt from token validation jwt');
      // console.log(decodedToken,'dedcodede');
      // console.log(decodedToken.userId,'decodedToken._id;');
      // console.log(decodedToken.role,'decodedToken.role');
      


      if (err) {
        res.json("unauthorized");
      }
      res.locals.userId = decodedToken.userId;
      res.locals.userRole = decodedToken.role;
      next();
    });
  }

 const verifyUser = (role) =>(req, res, next) => {
  // console.log('verfyuser from jwttt');
    verifyToken(req, res, () => {
      // console.log(role,'roleee');
      // console.log(res.locals.userRole,'res.locals.userRole');
      if (res.locals.userRole === role) {
        console.log('new user tokennnn');
        next();
      } else {
        res.json("unauthorized");
      }
    });
  };

 module.exports={verifyToken,verifyUser}
