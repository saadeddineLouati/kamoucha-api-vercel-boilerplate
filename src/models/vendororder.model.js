const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const vendororderSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productorder',
        required: true,
      },
    ],
    productsData: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      default: 'CREATED',
      required: true,
    },
    promocode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Promocode',
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
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
vendororderSchema.plugin(toJSON);
vendororderSchema.plugin(paginate);

/**
 * @typedef Vendororder
 */
const Vendororder = mongoose.model('Vendororder', vendororderSchema);

module.exports = Vendororder;
