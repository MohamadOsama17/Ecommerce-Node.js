const { isValidObjectId } = require('mongoose');
const Category = require('../models/categoryModel');
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
        message: 'No product found related !'
      });
    }
    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'No product found related !'
      });
    }
    return res.status(200).json({ product });
  } catch (error) {
    next(error)
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, coverImage, images, categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        'success': false,
        'message': 'Product category id is required !'
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        'success': false,
        'message': 'Product category id is required !'
      });
    }
    const product = await Product.create({ name, price, quantity, coverImage, images, category: category._id });
    await product.populate('category');
    return res.status(201).json({
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
    const maxPrice = parseFloat(req.query.maxPrice);
    const minPrice = parseFloat(req.query.minPrice);

    const sortField = req.query.sort;
    let order;
    if (req.query.order && sortField) {
      order = req.query.order === 'asc' ? 1 : -1
      console.log(order);
      console.log(sortField);
    }

    const options = {};
    if (maxPrice) {
      options.price = { $lte: maxPrice };
    }
    if (minPrice) {
      options.price = { ...options.price, $gte: minPrice };
    }

    const totalDocs = await Product.countDocuments(options);
    const pagination = pagenationResponse({ page, totalDocs, limit });
    const products = await Product.find(options).limit(limit).skip((page - 1) * limit).sort({ 'price': order }).populate('category');
    return res.status(200).json({
      success: true,
      products,
      pagination,
    })
  } catch (error) {
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    if (!searchQuery) {
      const totalDocs = await Product.countDocuments();
      const pagination = pagenationResponse({ page, totalDocs, limit });
      const products = await Product.find({}).limit(limit).skip((page - 1) * limit);
      return res.status(200).json({
        searchQuery,
        products,
        pagination,
      })
    }
    const regexSearch = new RegExp(`.*${searchQuery}.*`, 'i');
    const q = {
      $or: [
        { name: regexSearch },
        { coverImage: regexSearch }
      ]
    };
    const totalDocs = await Product.countDocuments(q);
    const pagination = pagenationResponse({ page, totalDocs, limit });
    const products = await Product.find(q).limit(limit).skip((page - 1) * limit).populate('category');

    return res.status(200).json({
      searchQuery,
      products,
      pagination,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getProductById, deleteProduct, updateProduct, createProduct, getAllProdcts, search }
