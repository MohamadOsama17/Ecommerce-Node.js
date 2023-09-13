
const getProductById = (req, res, next) => {
  const productId = req.params.productId;
  res.status(200).send(`get details for product : ${productId}`);
};

const deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  res.status(200).send(`delete details for product : ${productId}`);
};

const updateProduct = (req, res, next) => {
  const productId = req.params.productId;
  const { body } = req;
  res.status(200).send(`update details for product : ${productId},body :${body.name}`)
};

module.exports = { getProductById, deleteProduct, updateProduct }
