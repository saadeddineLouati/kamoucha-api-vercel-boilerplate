const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'subCategory', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await notificationService.queryNotifications({ ...filter, receiver: req.user._id }, options);
  res.send(result);
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification introuvable');
  }
  res.send(notification);
});

const markAllAsSeen = catchAsync(async (req, res) => {
  const notifications = await notificationService.markAllAsSeen(req.user._id);
  res.send(notifications);
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotification(
    { _id: req.params.notificationId, receiver: req.user._id },
    { isSeen: true }
  );
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification introuvable');
  }
  res.send(notification);
});

module.exports = {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsSeen,
};
