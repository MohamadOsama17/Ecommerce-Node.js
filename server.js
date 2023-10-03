const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const logger = require('./middlewares/logger')
const authenticateToken = require('./middlewares/authenticateToken');
const connectDB = require('./utils/dbConnection');

const productRoute = require('./routes/product/product');
const orderRoute = require('./routes/order/order');
const categoryRoute = require('./routes/category/category');
const cartRoute = require('./routes/cart/cart_route');
const path = require('path');

const errorHandler = require('./utils/errorHandluer');

const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  logger(req, next);
});


//CORS config
const whiteListOrigins = ['https://www.google.com', 'https://www.mywebsite.com', ''];
const corsOption = {
  origin: whiteListOrigins,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

app.use('/statics', express.static(path.join(__dirname, 'statics')));

// Routes
// Public Routes
const apiVersion = process.env.API_VERSION;
// Auth Routes
app.use(`${apiVersion}/auth`, require('./routes/auth/auth-route'));

// Protected Routes
app.use(`${apiVersion}/product`, authenticateToken, productRoute);
app.use(`${apiVersion}/order`, authenticateToken, orderRoute);
app.use(`${apiVersion}/category`, authenticateToken, categoryRoute)
app.use(`${apiVersion}/cart`, authenticateToken, cartRoute)


// Not Found Handler
app.use((req, res, next) => {
  const error = new Error('Not Found !');
  error.name = 'Not Found';
  next(error);
});


//Error Middleware
// app.use((error, req, res, next) => {
//   console.log(error.name);

//   try {
//     if (error.name === 'ValidationError') {
//       return handleMogooseValidationError(error, res)
//     }
//     handleJwtErrors(error, res);
//     res.status(error.status || 500).json({
//       'errorR': {
//         message: error?.message || 'something went wrong',
//         status: error.status || 500
//       }
//     });
//   } catch (error) {
//     console.log('catch');
//     res.status(error.status || 500).json({
//       'errorRR': {
//         message: error.message,
//         status: error.status || 500
//       }
//     });
//   }
// });

app.use(errorHandler)

mongoose.connection.once('open', () => {

  console.log('DB CONNECTED ...');
  app.listen(3000, () => {
    console.log('server working...');
  });
});
