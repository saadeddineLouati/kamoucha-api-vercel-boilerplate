/* eslint-disable no-restricted-syntax */
const webpush = require('web-push');
const { User } = require('../models');
const eventEmitter = require('../realtime/eventEmitter');

webpush.setVapidDetails(process.env.VAP_ID_SUBJECT, process.env.VAP_ID_PUBLIC_KEY, process.env.VAP_ID_PRIVATE_KEY);

/**
 *
 * @param {import('mongoose').ObjectId} userId
 * @param {any} payload
 */
const sendNotificationToUser = async (userId, payload) => {
  eventEmitter.emit('new-notification', { userId, ...payload });
  const user = await User.findById(userId);
  if (user && user.notificationSubscriptions && user.notificationSubscriptions.length > 0) {
    for (const subscription of user.notificationSubscriptions) {
      this.senPushNotification(subscription, payload);
    }
  }
};

/**
 *
 * @param {any} receiver
 * @param {any} payload
 */
const senPushNotification = async (receiver, payload) => {
  try {
    await webpush.sendNotification(
      receiver,
      JSON.stringify({
        icon: '/assets/images/logo.svg',
        badge: '/assets/images/icons/notification.svg',
        sound: 'default',
        ...payload,
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
  }
};

module.exports.senPushNotification = senPushNotification;
module.exports.sendNotificationToUser = sendNotificationToUser;
