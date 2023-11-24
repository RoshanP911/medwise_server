const jwt = require("jsonwebtoken");

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
      res.locals.userId = decodedToken.userId;
      res.locals.userRole = decodedToken.role;
      next();
    });
  }

 const verifyUser = (role) =>(req, res, next) => {
    verifyToken(req, res, () => {

      if (res.locals.userRole === role) {
        console.log('new user tokennnn');
        next();
      } else {
        res.json("unauthorized");
      }
    });
  };

 module.exports={verifyToken,verifyUser}
