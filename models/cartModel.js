const mongoose = require('mongoose');
const renameMongooseDocFields = require('../utils/renameMongoDocFields');

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
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

cartSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

renameMongooseDocFields(cartSchema,
  {
    '_id': 'id',
    '__v': undefined,
  }
);

cartSchema.virtual('totalCartPrice').get(function () {
  // Calculate the total price by summing the prices of products in the cart items
  return this.items.reduce((total, cartItem) => {
    // Assuming each cartItem has a product property with a price field
    return total + (cartItem.product.price * cartItem.quantity);
  }, 0);
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;

