const httpStatus = require('http-status');
const Notification = require('../models/notification.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for notifications
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotifications = async (filter, options) => {
  const notifications = await Notification.paginate(filter, {
    ...options,
    populate: 'sender:_id imgUrl name backgroundImg isDeleted isTrusted',
  });
  return notifications;
};

/**
 * Get notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (id) => {
  return Notification.findById(id);
};

/**
 * Get user unseen notifications
 * @param {ObjectId} user
 * @returns {Promise<Notification>}
 */
const getTotalUnseenNotifications = async (user) => {
  return Notification.countDocuments({ receiver: user, isSeen: false });
};

/**
 * Update notification
 * @param {ObjectId} likeId
 * @param {Object} updateBody
 * @returns {Promise<Like>}
 */
const updateNotification = async (notificationToUpdate, update) => {
  let notification = await Notification.findOne(notificationToUpdate);
  if (!notification) return;
  notification = await Notification.findOneAndUpdate(notificationToUpdate, update);
  return notification;
};

/**
 * Mark user notification as seen
 * @param {ObjectId} likeId
 * @param {Object} updateBody
 * @returns {Promise<Like>}
 */
const markAllAsSeen = async (user) => {
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification introuvable');
  }
  const notifications = await Notification.updateMany(
    { receiver: user, isSeen: false },
    {
      $set: {
        isSeen: true,
      },
    }
  );
  return notifications;
};

module.exports.queryNotifications = queryNotifications;
module.exports.getNotificationById = getNotificationById;
module.exports.updateNotification = updateNotification;
module.exports.getTotalUnseenNotifications = getTotalUnseenNotifications;
module.exports.markAllAsSeen = markAllAsSeen;
