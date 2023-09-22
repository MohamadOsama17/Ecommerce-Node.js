const ProductCategory = require('../models/productCategoryModel');

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const category = await ProductCategory.create({ name, image });
   return res.status(201).json({
      message: 'category created successfully !',
      category: category,
    });
  } catch (error) {
    console.log(error.name);
    next(error)
  }
}

const updateCategory = (req, res, next) => {
}

const deleteCategory = (req, res, next) => { }

const getCategoryById = (req, res, next) => { }

const getCategories = (req, res, next) => { }


module.exports = { createCategory, updateCategory, deleteCategory, getCategoryById, getCategories }
