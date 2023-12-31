const router = require('express').Router();
const orderController = require('../../controllers/orderController');
const appRoles = require('../../config/roles');
const verifyRole = require('../../middlewares/authroizeRole');


router.get('/', orderController.getAllOrders);

router.post('/', orderController.createNewOrder);

router.get('/:orderId', orderController.getOrderById);

router.patch('/:orderId', verifyRole([appRoles.Admin]), orderController.updateOrder)


module.exports = router;