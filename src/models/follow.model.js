const mongoose = require('mongoose');

const { Schema } = mongoose;

const followSchema = Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
  },
});

module.exports = mongoose.model('Follow', followSchema);
