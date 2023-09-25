const mongoose = require('mongoose');
const appRoles = require('../config/roles');
const renameMongooseDocFields = require('../utils/renameMongoDocFields');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required !'],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: 'Invalid email or password !',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required !'],

  },
  roles: {
    type: [Object],
    default: null,
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
  },
  firstName: {
    type: mongoose.Schema.Types.String,
    required: [true, 'First name is required !'],
  },
  lastName: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Last name is required !'],
  },
  mobileNumber: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Mobile number is required !'],
    validate: {
      validator: (value) => {
        return /^(059|056)\d{7}$/.test(value);
      },
      message: 'Invalid phone number !',
    }
  },
  address: {
    'city': {
      type: String,
      required: [true, 'City is required !']
    },
    'state': {
      type: String,
      required: [true, 'State is required !'],
    },
    'street': String,
  },
});


renameMongooseDocFields(userSchema,
  {
    '_id': 'id',
    '__v': undefined,
    'password': undefined,
  }
);



function isSubarray(subarray, array) {
  return subarray.every(subItem =>
    array.some(item =>
      item.id === subItem.id && item.name === subItem.name
    )
  );
}


const userModel = mongoose.model('User', userSchema);

module.exports = userModel;


