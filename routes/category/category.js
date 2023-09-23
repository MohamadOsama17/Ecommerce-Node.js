const router = require('express').Router();
const appRoles = require('../../config/roles');
const categoryController = require('../../controllers/categoryController');
const verifyRole = require('../../middlewares/authroizeRole');


router.route('/')
  .post(verifyRole([appRoles.Admin]), categoryController.createCategory)
  .get(categoryController.getAllCategories);

router.get('/:categoryId/products', categoryController.getAllCategoryProducts)

router.route('/:categoryId')
  .put(
    verifyRole([appRoles.Admin]),
    categoryController.updateCategory
  )
  .delete(
    verifyRole([appRoles.Admin]),
    categoryController.deleteCategory
  )
  .get(categoryController.getCategoryById);

module.exports = router;