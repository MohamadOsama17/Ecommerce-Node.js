const router = require('express').Router();

const appRoles = require('../../config/roles');
const productController = require('../../controllers/productController');
const verifyRole = require('../../middlewares/authroizeRole');


router.route('/')
  .get(productController.getAllProdcts)
  .post(verifyRole([appRoles.Admin, appRoles.Editor]), productController.createProduct);

router.get('/search', productController.search);

router.route('/:productId')
  .get(productController.getProductById)
  .delete(verifyRole([appRoles.Admin]), productController.deleteProduct)
  .patch(verifyRole([appRoles.Admin]), productController.updateProduct);


module.exports = router;