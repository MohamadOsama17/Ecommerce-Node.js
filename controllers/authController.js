const UserModel = require('../models/user');
const tokenUtils = require('../utils/generateToken');
const VerificationModel = require('../models/verification');
const verifyToken = require('../utils/verifyToken');
const bcrypt = require('bcrypt');
const appRoles = require('../config/roles');



const login = async (req, res, next) => {
  try {
    const { email,password } = req.body;
    // check email and password
    if (!email || !password) {
      return res.status(400).json({
        'message': 'email and password required!',
        'success': false
      });
    }
    // check if email exist
    const foundUser = await UserModel.findOne({email });
    if (!foundUser) {
      return res.status(400).json({
        'message': 'Wrong credintials',
        'success': false
      })
    }
    // compare password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(400).json({
        'message': 'Wrong credintials',
        'success': false
      })
    }
    // generate jwt
    const accessToken = tokenUtils.generateAccessToken(foundUser);
    const refreshToken = tokenUtils.generateRefreshToken(foundUser);
    // return response
    res.status(200).json({ user: foundUser, accessToken, refreshToken })

  } catch (error) {
    return next(error);
  }
}


const registerUser = async (req, res, next) => {
  try {
    // check username and password
    const { email, password, firstName, lastName, mobileNumber, address } = req.body;
    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // store new user
    const userData = {
      'email': email,
      'password': encryptedPassword,
      'roles': [appRoles.User],
      firstName,
      lastName,
      mobileNumber,
      address,
    }
    const storedUser = await UserModel.create(userData);
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
    return next(error);
  }
}



const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      'message': 'Refresh token is required !',
      'success': false,
    });
  }
  try {
    const decodedData = verifyToken.verifyRefreshToken(refreshToken);
    //search for the user in DB
    const foundUser = await UserModel.findOne({ 'email': decodedData.UserInfo.email });
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

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        'message': 'email is required to reset password !',
        'success': false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        'message': 'No user found !',
        'success': false,
      });
    }
    //generate code
    const code = (Math.floor(1000 + Math.random() * 9000)).toString();
    // const code = 1234;

    //save the record in verification model
    const verification = await VerificationModel.create({ email, code });
    if (!verification) {
      return res.status(400).json({
        'message': 'Somthing went wrong !',
        'success': false,
      });
    }
    //send code to email

    //generate JWT ==> email,code
    const forgetPasswordToken = tokenUtils.generateForgetPassToken({ email, code });

    //return response
    return res.status(200).json({
      'message': 'Verification code sent to your email, please check !',
      'success': true,
      forgetPasswordToken,
    })
  } catch (error) {
    next(error)
  }
}

const verifyForgetPassCode = async (req, res, next) => {
  try {
    const code = req.body.code;
    if (!code) {
      return res.status(400).json({
        'success': false,
        'message': 'Please provide reset password code !',
      });
    }
    const forgetPasswordToken = req.headers.forgetpasswordtoken;
    if (!forgetPasswordToken) {
      return res.status(400).json({
        'success': false,
        'message': 'Forget password token is required !',
      });
    }
    const tokenData = verifyToken.verifyForgetPasswordToken(forgetPasswordToken);
    if (!tokenData) {
      return res.status(400).json({
        'message': 'Token is not valid !',
        'success': false,
      });
    }
    const email = tokenData.email;
    const verificationRecord = await VerificationModel.findOne({ email });
    if (!verificationRecord) {
      return res.status(400).json({
        'success': false,
        'message': 'No verification process found !',
      });
    }
    const tokenCode = tokenData.code; //this is the forget pass code that stored in the token from [forgetPassword] function
    if (code !== tokenCode || code !== verificationRecord.code) {
      return res.status(400).json({
        'success': false,
        'message': 'Code is not correct !',
      });
    }
    const resetPasswordToken = tokenUtils.generateResetPassToken({ email });
    if (!resetPasswordToken) {
      return res.status(400).json({
        'success': false,
        'message': 'Somthing went wrong !',
      })
    }
    await VerificationModel.findByIdAndRemove(verificationRecord._id)
    return res.status(200).json({
      'success': true,
      'message': 'Code verified successfully, you can change your password now within 5 minutes !',
      resetPasswordToken,
    });
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {

    const resetPasswordToken = req.headers.resetpasswordtoken;
    if (!resetPasswordToken) {
      return res.status(400).json({
        'message': 'Reset password token is required !',
        'success': false,
      });
    }
    const tokenData = verifyToken.verifyResetPasswordToken(resetPasswordToken);
    if (!tokenData || !tokenData?.email) {
      return res.status(400).json({
        'message': 'Token is not valid !',
        'success': false,
      });
    }
    const password = req.body.password;
    if (!password) {
      return res.status(400).json({
        'message': 'New password is required !',
        'success': false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findOne({ email: tokenData.email });
    if (!user) {
      return res.status(400).json({
        'message': 'No user found !',
        'success': false,
      });
    }
    user.password = hashedPassword;
    user.role = user.role;
    await user.save();
    return res.status(200).json({
      'success': true,
      'message': 'Password is updated successfully !'
    })
  } catch (error) {
    next(error)
  }
}


module.exports = { login, registerUser, refreshToken, forgetPassword, verifyForgetPassCode, resetPassword }