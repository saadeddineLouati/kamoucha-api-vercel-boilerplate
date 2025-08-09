const mongoose = require('mongoose');
const { getBoostTypes } = require('../config/const');
const { toJSON, paginate } = require('./plugins');

const boostSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: getBoostTypes(),
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
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

boostSchema.index({ product: 1, date: 1 }, { unique: true });

// add plugin that converts mongoose to json
boostSchema.plugin(toJSON);
boostSchema.plugin(paginate);

/**
 * @typedef Boost
 */
const Boost = mongoose.model('Boost', boostSchema);

module.exports = Boost;
