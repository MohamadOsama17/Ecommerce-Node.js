const User = require('../models/user');
const verifyJwt = require('../utils/verifyToken')
const tokenUtils = require('../utils/generateToken');

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      'message': 'Refresh token is required !',
      'success': false,
    });
  }
  try {
    const decodedData = verifyJwt.verifyRefreshToken(refreshToken);
    //search for the user in DB
    const foundUser = await User.findOne({ 'username': decodedData.UserInfo.username });
    if (!foundUser) {
      return res.status(400).json({
        'message': 'No user found !',
        'success': false,
      });
    }
    const newAccessToken = tokenUtils.generateAccessToken(foundUser);
    const newRefreshToken = tokenUtils.generateRefreshToken(foundUser);
    return res.status(200).json({
      newAccessToken,
      newRefreshToken
    })
  } catch (error) {
    // return handleJwtErrors(error, res);
    // console.log('errrrrr');
    return next(error);
  }

}

module.exports = { refreshToken }