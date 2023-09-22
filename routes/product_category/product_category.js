const router = require('express').Router();
const appRoles = require('../../config/roles');
const productCategoryController = require('../../controllers/productCategoryController');
const verifyRole = require('../../middlewares/authroizeRole');


router.post('/', verifyRole([appRoles.Admin]), productCategoryController.createCategory);

module.exports = router;