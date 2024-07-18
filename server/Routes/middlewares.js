const jwt = require("jsonwebtoken");
const User = require('../model/SignupModel')


module.exports = async (req, res, next) => {
     console.log(req.cookies)
  try {

    const  token    = req.cookies.token;
    console.log("token",token)
   if( !token ){
        console.log("Login first to handle this resource");
        return res.status(400).send({
          message: "Login first to handle this resource",
          success: false,
        });
   }
   const decoded = jwt.verify(token, process.env.JWT_SECRET)
   req.user = await User.findById(decoded.id);
   req.decoded = decoded.id;
   next();


  } catch (error) {
    return res.status(401).send({
      message: "Auth failed",
      success: false,
    });
  }
};