const mongoose = require('mongoose');
const appRoles = require('../config/roles')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required !'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required !'],

  },
  roles: {
    type: [Object],
    default: null,
    // default: [appRoles.User],

    required: [true, 'User role is required !'],
    validate: [
      {
        validator: (value) => {
          if (value.length === 0 || !value) {
            return false;
          }
          return true;
        },
        message: 'User role is required !'
      },
      {
        validator: (value) => {
        var s =  value.map((role)=>{
            return Object.values(appRoles).includes(role)
          });
          return s.includes(true);
        },
        message: 'Incorrect user role !'
      },
    ]
  }
});


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;