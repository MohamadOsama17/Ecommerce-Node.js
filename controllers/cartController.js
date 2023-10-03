const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productsModel');

const getCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await findOrCreateCart(userId);
    cart?.populate('user');
    return res.status(200).json({ cart })
  } catch (error) {
    next(error);
  }
}

const addItemToCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        'success': false,
        'message': 'productId field is required !',
      });
    }
    const product = await ProductModel.findById(productId).populate('category');
    if (!product) {
      return res.status(400).json({
        'success': false,
        'message': 'No product found with provided id !',
      });
    }
    const cart = await findOrCreateCart(userId);

    

  } catch (error) {
    next(error)
  }
}

const removeItemFromCart = async (req, res, next) => { }

const clearCart = async (req, res, next) => { }


function getCartByUserId(userId) {
  return CartModel.findOne({ user: userId });
};

async function findOrCreateCart(userId) {
  let cart = await getCartByUserId(userId);
  if (!cart) {
    cart = await CartModel.create({ user: userId });
  }
  return cart;
}


module.exports = { getCart, addItemToCart, removeItemFromCart, clearCart }

