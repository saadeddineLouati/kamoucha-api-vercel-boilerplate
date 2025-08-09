const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { notificationStatus } = require('../config/const');

const getNotifications = {
  query: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    sender: Joi.string().custom(objectId),
    receiver: Joi.string().custom(objectId),
    status: Joi.string().custom(objectId).valid(notificationStatus.IS_SENT, notificationStatus.IS_SEEN),
    url: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const patchNotification = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};
module.exports = {
  getNotifications,
  getNotification,
  patchNotification,
};
