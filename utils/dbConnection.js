const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI);
  } catch (error) {
    console.error(error);
    console.error(`error in mongoDB connection :${error}`);
  }
}

module.exports = connectDB;