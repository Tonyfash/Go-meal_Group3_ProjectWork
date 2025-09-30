const userModel = require("../model/user");
const jwt = require("jsonwebtoken");

exports.checkLogin = (req, res, next) => {
    try {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Kindly login"
    });
  }
    const checkValidToken = jwt.verify(token.split(" ")[1],"cat", async (error, result) =>{
        if(error){
            return res.status(401).json({
                message: "Login session expired, please login again"
            });
        }else{
            const user = await userModel.findById(result.id);
        
            req.user = user._id;
            next();
        }
    });
} catch (error) {
  res.status(500).json({
    message: "Internal Server Error"
  });
}
};
