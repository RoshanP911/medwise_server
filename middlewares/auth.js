const jwt = require("jsonwebtoken");


(module.exports.userjwt = async (req, res, next) => {
    try {
      const usertoken = req.headers["authorization"]?.split(" ")[1];
      if (!usertoken) {
        res.send({ status: "failed", message: "You need token ok" });
      } else {
        jwt.verify(usertoken, process.env.JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            // console.log(err);
            res
              .status(401)
              .send({ message: "user Auth Failed", success: false });
          } else {  
            req.userId = decoded.userId;
            next();
          }
        });
      }
    } catch (error) {
      console.log("hyyyyy");
      return res.status(401).send({
        message: "Auth failed ayi",
        success: false,
      });
    }
  });