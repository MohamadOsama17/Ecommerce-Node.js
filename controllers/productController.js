const { isValidObjectId } = require('mongoose');
const Product = require('../models/productsModel');
const pagenationResponse = require('../response/pagenationResponse')


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

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId)) {
      return res.status(404).json({
        success: false,
        message: 'No product found !'
      });
    }
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'No product found !'
      });
    }
    await product.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully !"
    });
  } catch (error) {
    return next(error)
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId)) {
      return res.status(404).json({
        success: false,
        message: 'No product found !'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'No product found !'
      });
    }

    const { name, price, coverImage } = req.body;
    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (coverImage) {
      product.coverImage = coverImage;
    }
    const result = await product.save();
    return res.status(200).json({ success: true, product: result })
  } catch (error) {
    next(error);
  }
};

const getAllProdcts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const totalDocs = await Product.countDocuments();
    const pagination = pagenationResponse({ page, totalDocs, limit });
    const products = await Product.find({}).limit(limit).skip((page - 1) * limit);
    return res.status(200).json({
      success: true,
      products,
      pagination,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getProductById, deleteProduct, updateProduct, createProduct, getAllProdcts }
