const mongoose = require('mongoose');
const appRoles = require('../config/roles')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required !'],
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
          const appRolesValues = Object.values(appRoles)
          return isSubarray(value, appRolesValues);;
        },
        message: 'Incorrect user role !'
      },
    ]
  }
});

function isSubarray(subarray, array) {
  return subarray.every(subItem =>
    array.some(item =>
      item.id === subItem.id && item.name === subItem.name
    )
  );
}


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;