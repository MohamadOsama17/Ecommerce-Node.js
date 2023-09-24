const { default: mongoose } = require("mongoose");

//email
//code
//createdAt

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const VerificationModel = mongoose.model('Verification', verificationSchema);

module.exports = VerificationModel;