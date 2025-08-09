const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const UserSnapshotSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: 'User',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    imgUrl: {
      type: String,
    },
    backgroundImg: {
      type: String,
    },
    snapshots: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
UserSnapshotSchema.plugin(toJSON);
UserSnapshotSchema.plugin(paginate);

/**
 * @typedef UserSnapshot
 */
const UserSnapshot = mongoose.model('UserSnapshot', UserSnapshotSchema);

module.exports = UserSnapshot;
