const router = require('express').Router();

const appRoles = require('../../config/roles');
const productController = require('../../controllers/productController');
const verifyRole = require('../../middlewares/authroizeRole');

const createUploader = require('../../utils/filesUploader');

const uploader = createUploader('statics/products-images');

router.route('/')
  .get(productController.getAllProdcts)
  .post(verifyRole([appRoles.Admin, appRoles.Editor]), uploader.single('image'), productController.createProduct);

router.get('/search', productController.search);

router.route('/:productId')
  .get(productController.getProductById)
  .delete(verifyRole([appRoles.Admin]), productController.deleteProduct)
  .patch(verifyRole([appRoles.Admin]), productController.updateProduct);


module.exports = router;