const { isValidObjectId } = require('mongoose');
const Category = require('../models/categoryModel');
const Product = require('../models/productsModel');
const pagenationResponse = require('../response/pagenationResponse');

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const category = await Category.create({ name, image });
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

    let category = await Category.findById(categoryId);
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
    const category = await Category.findByIdAndRemove(categoryId);
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
    const category = await Category.findById(categoryId);
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
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    let query = {};
    if (searchQuery) {
      const regexSearch = new RegExp(`.*${searchQuery}.*`, 'i');
      query = {
        $or: [
          { name: regexSearch },
        ]
      };
    }
    if (minPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice }

    }
    const totalDocs = await Category.countDocuments(query);
    const categories = await Category.find(query).limit(limit).skip((page - 1) * limit);
    const pagination = pagenationResponse({ page: page, limit: limit, totalDocs: totalDocs });
    return res.status(200).json({ categories, pagination })
  } catch (error) {
    next(error)
  }
}



const getAllCategoryProducts = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    const searchQuery = req.query.q;
    const sortQuery = req.query.sort;

    const query = { 'category': categoryId };

    if (searchQuery) {
      const regexSearch = new RegExp(`.*${searchQuery}.*`, 'i');
      query.$or = [{ name: regexSearch },];
    }
    if (minPrice) {
      query.price = { $gte: minPrice };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: maxPrice }
    }

    let sort = {};
    if (sortQuery) {
      sort = appendSortValues(sortQuery)
    }

    if (!categoryId) {
      return sendNoCategoryFoundResponse(res);
    }
    if (!isValidObjectId(categoryId)) {
      return sendNoCategoryFoundResponse(res);
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return sendNoCategoryFoundResponse(res);
    }

    const products = await Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('category')
      .sort(sort);

    const totalDocs = await Product.countDocuments(query).sort(sort);
    const pagination = pagenationResponse({ page, totalDocs, limit });

    return res.status(200).json({ products, pagination });
  } catch (error) {
    next(error);
  }
}

function sendNoCategoryFoundResponse(res) {
  return res.status(400).json({
    'message': 'No category found !',
    'success': false,
  });
}

// ['price_asc', 'price_desc', 'name_a2z', 'name_z2a', 'quantity_asc', 'quantity_desc'];
function appendSortValues(value) {
  switch (value) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'name_a2z':
      return { name: 1 };
    case 'name_z2a':
      return { name: -1 };
    case 'quantity_asc':
      return { quantity: 1 }
    case 'quantity_desc':
      return { quantity: -1 }
    default:
      return {};
  }
}


module.exports = { createCategory, updateCategory, deleteCategory, getCategoryById, getAllCategories, getAllCategoryProducts }
