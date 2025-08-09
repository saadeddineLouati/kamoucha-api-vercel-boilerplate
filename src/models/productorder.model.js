const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productorderSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    qty: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'CREATED',
      required: true,
    },
    shippingdate: {
      type: Date,
    },
    shippingstartdate: {
      type: Date,
    },
    shippingenddate: {
      type: Date,
    },
    created_at: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productorderSchema.plugin(toJSON);
productorderSchema.plugin(paginate);

/**
 * @typedef Productorder
 */
const Productorder = mongoose.model('Productorder', productorderSchema);

module.exports = Productorder;
