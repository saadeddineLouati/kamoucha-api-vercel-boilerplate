const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { toJSON, paginate } = require('./plugins');
const { getContentTypes } = require('../config/const');

mongoose.plugin(slug);

const contentSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: getContentTypes(),
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
    },
    path: {
      type: String,
    },
    category: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
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
contentSchema.plugin(toJSON);
contentSchema.plugin(paginate);

/**
 * @typedef Content
 */
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
