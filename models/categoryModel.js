const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
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

const CategoryModel = mongoose.model('ProductCategory', categorySchema);

module.exports = CategoryModel;