const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      city: {
        type: mongoose.Schema.Types.String,
        required: [true, 'City is required !'],

      },
      street: {
        type: mongoose.Schema.Types.String,
        required: [true, 'Street is required !'],
      },
      buildingNum: mongoose.Schema.Types.Number,
    },
    totalPrice: {
      required: [true, 'Total price must be provided !'],
      min: [1, 'Total price can not be less than 1 !'],
      type: Number,
      // cast: '{VALUE} is not a valid number',
      cast: 'Total price is not a valid number',
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      default: Date.now,
    },
    updatedAt: mongoose.Schema.Types.Date,
  }
);


orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const orderModel = mongoose.model('ORDER', orderSchema);


module.exports = orderModel;