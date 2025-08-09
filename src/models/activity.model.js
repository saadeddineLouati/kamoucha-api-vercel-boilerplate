const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const activitySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
      enum: ['Free', 'Deal', 'Discussion', 'PromoCode', 'Comment', 'Like'],
    },
    status: {
      type: String,
      default: '0',
    },
    brand: {
      type: String,
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
    indexes: [{ post: 1, postType: 1 }],
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
activitySchema.plugin(toJSON);
activitySchema.plugin(paginate);

/**
 * @typedef Activity
 */
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
