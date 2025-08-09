const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { toJSON, paginate } = require('./plugins');
const { getAlertTypes } = require('../config/const');

mongoose.plugin(slug);

const alertSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      required: true,
      enum: getAlertTypes(),
    },
    subCategory: {
      type: String,
    },
    category: {
      type: String,
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
alertSchema.plugin(toJSON);
alertSchema.plugin(paginate);

/**
 * @typedef Alert
 */
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
