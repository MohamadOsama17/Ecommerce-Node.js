const mongoose = require('mongoose');


const productCategorySchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    unique: true,
    uniqueCaseInsensitive: true,
    required: [true, 'Category name is required !'],
  },
  image: {
    type: mongoose.Schema.Types.String,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  }
});

const ProductCategoryModel = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategoryModel;