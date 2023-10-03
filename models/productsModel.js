const mongoose = require('mongoose');
/*

{
  name:'',
  price:1212,
  quantity:212,
  coverImage:"",
  images:['',''],

}

*/
const productSchema = new mongoose.Schema({
  name: {
    required: [true, 'Product name is required !'],
    type: mongoose.Schema.Types.String,
    min: [6, 'Product name length should be more than or equal 6 !'],
    max: [256, 'Product name length should be less than  256 !']
  },
  description: {
    required: [true, 'Product description is required !'],
    type: mongoose.Schema.Types.String,
    min: [6, 'Product description length should be more than or equal 6 !'],
    max: [256, 'Product description length should be less than  256 !']
  },
  image: {
    type: mongoose.Schema.Types.String,
    required: [true, 'Product image is required !'],
    validate: {
      validator: (value) => {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
      },
      message: 'Invalid product image URL !',
    }
  },
  images: {
    type: [
      {
        type: mongoose.Schema.Types.String,
        validate: {
          validator: (value) => {
            return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
          },
          message: 'Invalid product image URL !',
        }
      },
    ],
    default: [],
  },
  price: {
    required: [true, 'Product price is required !'],
    min: [1, 'Product price should be 1 or greater !'],
    type: mongoose.Schema.Types.Number,
    cast: 'Product price invalid !',
  },
  quantity: {
    type: Number,
    cast: 'Product quantity invalid !',
    default: 1,
    min: [1, 'Product quantity should be 1 or greater !'],
  },
  // coverImage: {
  //   required: [true, 'Product image is required !'],
  //   type: mongoose.Schema.Types.String,
  //   cast: 'Invalid image type !',
  // },
  // images: {
  //   type: [[''], 'Product images should be array of string !'],
  //   default: [],
  // },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: [true, 'Product category id is required !']
  },
  rating: {
    type: mongoose.Schema.Types.Number,
    cast: 'Invalid rating !',
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  }
});


const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;