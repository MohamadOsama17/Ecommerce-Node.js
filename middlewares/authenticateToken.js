const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        "message": "Unauthorized",
        "success": false,
      });
    }
    const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!userData) {
      return res.status(401).json({
        "message": "Forbiden",
        "success": false,
      });
    }
    req.username = userData.UserInfo.username;
    req.userId = userData.UserInfo.userId;
    req.userRoles = userData.UserInfo.roles;
    next();
  } catch (error) {
    console.log(`Error in authenticateToken :${error}`);
    // handleJwtErrors(error, res);
    next(error)
  }
}



module.exports = authenticateToken;