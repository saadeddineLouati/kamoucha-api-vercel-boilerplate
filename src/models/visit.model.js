const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { toJSON, paginate } = require('./plugins');

mongoose.plugin(slug);

const visitSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'postType',
    },
    postType: {
      type: String,
      required: true,
      enum: ['Free', 'Deal', 'Discussion', 'PromoCode', 'Comment', 'Catalogue'],
    },
    type: {
      type: String,
    },
    ip: {
      type: String,
    },
    isAnonym: {
      type: Boolean,
      default: true,
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
visitSchema.plugin(toJSON);
visitSchema.plugin(paginate);

/**
 * @typedef Visit
 */
const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
