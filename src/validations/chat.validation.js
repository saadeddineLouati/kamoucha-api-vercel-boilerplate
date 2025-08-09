const Joi = require('joi');
const { objectId } = require('./custom.validation');
const { notificationStatus } = require('../config/const');

const createChat = {
  body: Joi.object().keys({
    message: Joi.string().required(),
    product: Joi.string().custom(objectId),
    receiver: Joi.string().custom(objectId).required(),
    sender: Joi.string().custom(objectId).required(),
  }),
};

const getChats = {
  query: Joi.object().keys({
    product: Joi.string().custom(objectId),
    receiver: Joi.string().custom(objectId),
    sender: Joi.string().custom(objectId),
    status: Joi.string().valid(notificationStatus.IS_SENT, notificationStatus.IS_SEEN),
  }),
};

const getChat = {
  params: Joi.object().keys({
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createChat,
  getChats,
  getChat,
};
