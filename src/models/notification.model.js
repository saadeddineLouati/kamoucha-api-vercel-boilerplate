const mongoose = require('mongoose');
const { getNotificationStatus, getNotificationTypes } = require('../config/const');
const { toJSON, paginate } = require('./plugins');

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'The title is required'],
    },
    content: {
      type: String,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true,
    },
    status: {
      type: String,
      enum: getNotificationStatus(),
    },
    type: {
      type: String,
      enum: getNotificationTypes(),
    },
    imageUrl: {
      type: String,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
    created_at: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    indexes: [
      {
        sender: 1,
        receiver: 1,
        type: 1,
        status: 1,
        isSeen: 1,
      },
    ],
  }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
