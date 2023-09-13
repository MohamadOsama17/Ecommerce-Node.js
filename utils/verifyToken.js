const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAccessToken = accessToken =>
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);


const verifyRefreshToken = refreshToken => jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);


module.exports = { verifyAccessToken, verifyRefreshToken }