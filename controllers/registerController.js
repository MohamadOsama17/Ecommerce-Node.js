const bcrypt = require('bcrypt');
const appRoles = require('../config/roles');
const User = require('../models/user');
const tokenUtils = require('../utils/generateToken');

const registerUser = async (req, res, next) => {
  try {
    // check username and password
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        'message': 'username and password required!',
        'success': false
      });
    }


    // check if username unique
    const foundUser = await User.findOne({ 'username': username });
    if (foundUser) {
      return res.status(400).json({
        'message': 'username already taken!',
        'success': false
      });
    }
    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // store new user
    const userData = {
      'username': username,
      'password': encryptedPassword,
      'roles': [appRoles.User]
    }
    const storedUser = await User.create(userData);
    // generate tokens
    const accessToken = tokenUtils.generateAccessToken(storedUser);
    const refreshToken = tokenUtils.generateRefreshToken(storedUser);
    // return response
    res.status(201).json({
      'message': 'user created succesfuly!',
      'success': true,
      'user': storedUser,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    // console.log(error.name);
    // res.status(500).json({
    //   'message': `Internal server error ${error}`,
    //   'success': false
    // })
    return next(error);
  }
}

module.exports = { registerUser }