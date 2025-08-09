const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFollow = {
  body: Joi.object().keys({
    followed: Joi.string().custom(objectId).required(),
  }),
};

const getFollows = {
  query: Joi.object().keys({
    follower: Joi.string().custom(objectId),
    followed: Joi.string().custom(objectId),
  }),
};

const getFollow = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deleteFollow = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createFollow,
  getFollows,
  getFollow,
  deleteFollow,
};
