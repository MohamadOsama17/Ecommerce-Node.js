const { isValidObjectId } = require('mongoose');
const Product = require('../models/productsModel')


const getProductById = async (req, res, next) => {
  try {

    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'You should pass product id'
      });
    }
    if (!isValidObjectId(productId)) {
      return res.status(404).json({
        success: false,
        message: 'No product found related !qw'
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'No product found related wq!'
      });
    }
    return res.status(200).json({ product });
  } catch (error) {
    next(error)
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, coverImage, images } = req.body;
    const product = await Product.create({ name, price, quantity, coverImage, images });
    res.status(201).json({
      'success': true,
      product,
    })
  } catch (error) {
    return next(error)
  }
}

const deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  res.status(200).send(`delete details for product : ${productId}`);
};

const updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const { body } = req;
  res.status(200).send(`update details for product : ${productId},body :${body.name}`)
};

module.exports = { getProductById, deleteProduct, updateProduct, createProduct }
