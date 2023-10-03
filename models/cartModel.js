const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  quantity: {
    type: mongoose.Schema.Types.Number,
    default: 1,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    requitred: true,
  }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
  updatedAt: mongoose.Schema.Types.Date,
});

cartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;

