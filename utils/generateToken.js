const jwt = require('jsonwebtoken');
require('dotenv').config;


const generateAccessToken = (userData) => {

  if (!userData) return;

  const { _id, roles, email } = userData;

  const error = new Error('Something went wrong!');
  error.name = 'generateAccessToken';

  if (!_id || !roles || !email) {
    throw error;
  }
  try {
    const rolesCodeArr = roles.map((role) => role.code);
    const payload = { userId: _id, email: email, roles: rolesCodeArr };
    const accessToken = jwt.sign({ UserInfo: payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15h' });
    return accessToken;
  } catch (error) {
    console.log(`Error in generate access token : ${error}`);
    throw error;
  }
}

const generateRefreshToken = (userData) => {
  if (!userData) return;

  const { _id, roles, email } = userData;

  const error = new Error('Something went wrong!');
  error.name = 'generateRefreshToken';

  if (!_id || !roles || !email) {
    throw error;
  }
  try {
    const rolesCodeArr = roles.map((role) => role.code);
    const payload = { userId: _id, email: email, roles: rolesCodeArr };

    const refreshToken = jwt.sign({ UserInfo: payload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });

    return refreshToken;
  } catch (error) {
    console.log(`error in generate refresh token :${error}`);
    throw error;
  }
}

//email,code
const generateForgetPassToken = (data) => {
  if (!data) return;
  const { email, code } = data;
  if (!email || !code) {
    throw Error('Something went wrong!');
  }
  try {
    return jwt.sign({ email, code }, process.env.FORGET_PASS_SECRET, { expiresIn: '5m' });
  } catch (error) {
    throw error;
  }
}

//email
const generateResetPassToken = (data) => {
  if (!data) return;
  const { email } = data;
  if (!email) {
    throw Error('Something went wrong!');
  }
  try {
    return jwt.sign({ email }, process.env.RESET_PASS_SECRET, { expiresIn: '5m' });
  } catch (error) {
    throw error;
  }
}

module.exports = { generateRefreshToken, generateAccessToken, generateForgetPassToken, generateResetPassToken }