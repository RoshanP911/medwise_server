const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1];
  console.log(token,'tokkkkkkkkkkkkkkk');
    if (!token) {
        console.log('no token');
        // return res
        // .status(401)
        // .json({ message: 'Authentication token not present', success: false});
        return res
        .status(200)
        .json({ message: 'Authentication token not present', success: false});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err,'errrrrrrrrrrrrr');
        // return res.status(403).json({ error: 'Invalid or expired token.' });
        return
      }

    console.log('successs');
      next();
    });
  };


 module.exports={verifyToken}

