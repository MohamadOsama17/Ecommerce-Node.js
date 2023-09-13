const bcrypt = require('bcrypt');
const tokenUtils = require('../utils/generateToken');
const User = require('../models/user')

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // check username and password
    if (!username || !password) {
      return res.status(400).json({
        'message': 'username and password required!',
        'success': false
      });
    }
    // check if username exist
    const foundUser = await User.findOne({ username: req.body.username });
    if (!foundUser) {
      return res.status(400).json({
        'message': 'no user found',
        'success': false
      })
    }
    // compare password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(400).json({
        'message': 'wrong credintials',
        'success': false
      })
    }
    // generate jwt
    const accessToken = tokenUtils.generateAccessToken(foundUser);
    const refreshToken = tokenUtils.generateRefreshToken(foundUser);
    // return response
    res.status(200).json({ user: foundUser, accessToken, refreshToken })

  } catch (error) {
    // res.status(500).json({
    //   'message': `Internal server error ${error}`,
    //   'success': false
    // })
    return next(error);
  }
}

module.exports = { login }