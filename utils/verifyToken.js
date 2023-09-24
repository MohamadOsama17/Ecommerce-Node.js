const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccessToken = accessToken =>
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);


const verifyRefreshToken = refreshToken => jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

const verifyForgetPasswordToken = forgetPassToken => jwt.verify(forgetPassToken, process.env.FORGET_PASS_SECRET);

const verifyResetPasswordToken = resetPassToken => jwt.verify(resetPassToken, process.env.RESET_PASS_SECRET);

module.exports = { verifyAccessToken, verifyRefreshToken, verifyForgetPasswordToken, verifyResetPasswordToken }