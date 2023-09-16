const router = require('express').Router();
const appRoles = require('../../config/roles');
const productController = require('../../controllers/productController');
const verifyRole = require('../../middlewares/authroizeRole');


router.route('/').get((req, res, next) => {
  res.status(200).send('<h1>page route</h1>')
}).post(verifyRole([appRoles.Admin, appRoles.Editor]), productController.createProduct);


router.route('/:productId')
  .get(productController.getProductById)
  .delete(verifyRole([appRoles.Admin]), productController.deleteProduct)
  .patch(verifyRole([appRoles.Admin]), productController.updateProduct);


module.exports = router;