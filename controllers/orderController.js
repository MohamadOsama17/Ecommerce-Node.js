const getAllOrders = (req, res, next) => {
  res.status(200).send(`all orders`);
};

const createNewOrder = (req, res, next) => {
  res.status(201).send('create new order');
};

const getOrderById = (req, res, next) => {
  const orderId = req.params.orderId;
  res.status(200).send(`get order that has :${orderId} id`)
};

module.exports = { getAllOrders, createNewOrder, getOrderById }