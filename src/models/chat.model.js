const mongoose = require('mongoose');
const { getNotificationStatus, notificationStatus } = require('../config/const');
const { paginate } = require('./plugins');

const { Schema } = mongoose;

const chatSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
      required: [true, 'The sender is required'],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
      required: [true, 'The receiver is required'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      autopopulate: true,
    },
    status: {
      type: String,
      required: true,
      default: notificationStatus.IS_SENT,
      enum: getNotificationStatus(),
    },
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
// chatSchema.plugin(toJSON);
chatSchema.plugin(paginate);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
