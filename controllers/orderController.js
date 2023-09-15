const { isValidObjectId } = require('mongoose');
const Order = require('../models/orderModel');
const pagenationResponse = require('../response/pagenationResponse');
const userResponse = require('../response/userResponse');

const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;
    const skip = (page - 1) * limit;
    const totalDocs = await Order.countDocuments();
    const pagination = pagenationResponse({
      page,
      limit,
      totalDocs,
    });

    const orders = await Order.find({}).skip(skip).limit(limit).populate('user');

    res.status(200).json({
      'success': true,
      orders,
      ...pagination,
    });
  } catch (error) {
    next(error);
  }
};

const createNewOrder = async (req, res, next) => {
  //get user id
  try {
    const { userId: user } = req;
    const { totalPrice, address } = req.body;
    const order = await Order.create({ user, totalPrice, address });
    await order.populate('user')
    order.user = userResponse(order.user);
    res.status(201).json({
      'success': true,
      order
    });
  } catch (error) {
    next(error)
  }
};



const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({
        'success': false,
        'message': 'Order ID required !'
      });
    }
    if (!isValidObjectId(orderId)) {
      return res.status(404).json({
        'success': false,
        'message': 'No order found related to the id !',
      });
    }
    const order = await Order.findById(orderId).then((foundedOrder) => foundedOrder.populate('user'));
    if (!order) {
      return res.status(404).json({
        'success': false,
        'message': 'No order found related to the id !',
      });
    }
    order.user = userResponse(order.user);
    return res.status(200).json({
      'success': true,
      order,
    })
  } catch (error) {
    next(error);
  }
}



module.exports = { getAllOrders, createNewOrder, getOrderById }