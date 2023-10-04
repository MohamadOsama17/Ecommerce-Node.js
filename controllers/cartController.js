const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productsModel');

const getCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await findOrCreateCart(userId);
    await cart?.populate('user');
    await cart?.populate('items.product')
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
    //if cart is empty
    // if (cart.items.length == 0) {
    //   const cartItem = {
    //     quantity: 1,
    //     product: product._id,
    //   };
    //   cart.items.push(cartItem)
    // }
    //check if item already exist
    const cartItem = cart.items.find((item) => item.product?.toString() === productId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      const cartItem = {
        quantity: 1,
        product: product._id,
      };
      cart.items.push(cartItem)
    }
    await cart.save();
    await cart.populate('items.product');
    return res.status(200).json({
      'success': true,
      'message': 'Product is added to cart !',
      cart,
    });
  } catch (error) {
    next(error)
  }
}

const removeItemFromCart = async (req, res, next) => {
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
    const itemCart = cart.items.find((item) => item.product.toString() === productId);
    if (!itemCart) {
      return res.status(400).json({
        'success': false,
        'message': 'Product is not in your cart !',
      });
    }
    if (itemCart.quantity > 1) {
      itemCart.quantity -= 1;
    } else {
      cart.items.remove(itemCart);
    }
    await cart.save();
    await cart.populate('items.product');
    return res.status(200).json({
      'success': true,
      'message': 'Product is removed from cart !',
      cart,
    });
  } catch (error) {
    next(error)
  }
}

const clearCart = async (req, res, next) => {
  try {
    const { userId } = req;
    const cart = await getCartByUserId(userId);
    if (cart) {
      cart.items = [];
    }
    await cart.save();
    return res.status(200).json({
      'success': true,
      'message': 'Cart is cleared !',
      cart,
    });
  } catch (error) {
    next(error)
  }
}


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

