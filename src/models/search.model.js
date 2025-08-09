const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { toJSON, paginate } = require('./plugins');

mongoose.plugin(slug);

const searchSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
    },
    withNotifications: {
      type: Boolean,
      default: true,
    },
    merchand: {
      type: String,
    },
    query: {
      type: mongoose.Schema.Types.Mixed,
    },
    created_at: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    indexes: [
      {
        query: 1,
        type: 1,
        withNotifications: 1,
        created_at: 1,
      },
    ],
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
searchSchema.plugin(toJSON);
searchSchema.plugin(paginate);

/**
 * @typedef Search
 */
const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
