const jwt = require('jsonwebtoken');
require('dotenv').config;


const generateAccessToken = (userData) => {

  if (!userData) return;

  const { _id, roles, username } = userData;

  const error = new Error('Something went wrong!');
  error.name = 'generateAccessToken';

  if (!_id || !roles || !username) {
    throw error;
  }
  try {
    const rolesCodeArr = roles.map((role) => role.code);
    const payload = { userId: _id, username, roles: rolesCodeArr };
    const accessToken = jwt.sign({ UserInfo: payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    return accessToken;
  } catch (error) {
    console.log(`Error in generate access token : ${error}`);
    throw error;
  }
}

const generateRefreshToken = (userData) => {
  if (!userData) return;

  const { _id, roles, username } = userData;

  const error = new Error('Something went wrong!');
  error.name = 'generateRefreshToken';

  if (!_id || !roles || !username) {
    throw error;
  }
  try {
    const rolesCodeArr = roles.map((role) => role.code);
    const payload = { userId: _id, username, roles: rolesCodeArr };

    const refreshToken = jwt.sign({ UserInfo: payload }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15d' });

    return refreshToken;
  } catch (error) {
    console.log(`error in generate refresh token :${error}`);
    throw error;
  }
}

module.exports = { generateRefreshToken, generateAccessToken }