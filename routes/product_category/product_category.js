const router = require('express').Router();
const appRoles = require('../../config/roles');
const productCategoryController = require('../../controllers/productCategoryController');
const verifyRole = require('../../middlewares/authroizeRole');


router.route('/')
  .post(verifyRole([appRoles.Admin]), productCategoryController.createCategory)
  .get(productCategoryController.getCategories);

router.route('/:categoryId')
  .put(
    verifyRole([appRoles.Admin]),
    productCategoryController.updateCategory
  )
  .delete(
    verifyRole([appRoles.Admin]),
    productCategoryController.deleteCategory
  )
  .get(productCategoryController.getCategoryById);

module.exports = router;