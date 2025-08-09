const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  street: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  town: {
    type: String,
  },
  country: {
    type: String,
    default: 'Tunisia',
  },
  phoneNumber: {
    type: String,
  },
  addresscomplement: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
  },
});

module.exports = mongoose.model('Address', addressSchema);
