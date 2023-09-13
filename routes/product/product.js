const router = require('express').Router();
const productController = require('../../controllers/productController');


router.route('/').get((req, res, next) => {
  res.status(200).send('<h1>page route</h1>')
}).post((req, res, next) => {
  res.status(201).send('product created...')
});


router.route('/:productId')
  .get(productController.getProductById)
  .delete(productController.deleteProduct)
  .patch(productController.updateProduct);


module.exports = router;