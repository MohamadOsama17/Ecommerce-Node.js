const router = require('express').Router();
const cartController = require('../../controllers/cartController')


/*
1- get cart ==> /cart/ GET
- user userId in token to get the cart 
- if user have'nt any cart will create one and return it [Empty cart]

2- add to cart ==> /cart/add POST
- body {
  productId: "",
}

3- remove from cart ==> /cart/remove PATCH
- body {
  productId: "",
}

4- delete/clear cart ==> /cart/ DELETE

*/

router.route('/')
  .get(cartController.getCart)
  .delete(cartController.clearCart);

router.post('/add', cartController.addItemToCart);
router.post('/remove', cartController.removeItemFromCart);


module.exports = router;