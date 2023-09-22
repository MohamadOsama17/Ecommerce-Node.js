const { isValidObjectId } = require('mongoose');
const ProductCategory = require('../models/productCategoryModel');
const pagenationResponse = require('../response/pagenationResponse');

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const category = await ProductCategory.create({ name, image });
    return res.status(201).json({
      'message': 'category created successfully !',
      'category': category,
    });
  } catch (error) {
    next(error)
  }
}

const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return sendNoCategoryFoundResponse(res);
    }

    let category = await ProductCategory.findById(categoryId);
    if (!category) {
      return sendNoCategoryFoundResponse(res);
    }

    const { name, image } = req.body;
    category.name = name;
    if (image) {
      category.image = image;
    }
    category = await category.save();

    return res.status(200).json({
      'message': 'Category updated successfully !',
      category
    });
  } catch (error) {
    return next(error)
  }
}

const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return sendNoCategoryFoundResponse(res);
    }
    const category = await ProductCategory.findByIdAndRemove(categoryId);
    if (!category) {
      return sendNoCategoryFoundResponse(res);
    }
    return res.status(200).json({
      'message': 'Category deleted successfully !',
      'success': true,
    })
  } catch (error) {
    next(error)
  }
}

const getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (!isValidObjectId(categoryId)) {
      return sendNoCategoryFoundResponse(res);
    }
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return sendNoCategoryFoundResponse(res);
    }
    return res.status(200).json({ category })
  } catch (error) {
    next(error);
  }
}

const getAllCategories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.q;
    let query = {};
    if (searchQuery) {
      const regexSearch = new RegExp(`.*${searchQuery}.*`, 'i');
      query = {
        $or: [
          { name: regexSearch },
        ]
      };
    }
    const totalDocs = await ProductCategory.countDocuments(query);
    const categories = await ProductCategory.find(query).limit(limit).skip((page - 1) * limit);
    const pagination = pagenationResponse({ page: page, limit: limit, totalDocs: totalDocs });
    return res.status(200).json({ categories, pagination })
  } catch (error) {
    next(error)
  }
}

function sendNoCategoryFoundResponse(res) {
  return res.status(400).json({
    'message': 'No category found !',
    'success': false,
  });
}


module.exports = { createCategory, updateCategory, deleteCategory, getCategoryById, getCategories: getAllCategories }
