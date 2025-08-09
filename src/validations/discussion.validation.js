const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDiscussion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    tags: Joi.array(),
    images: Joi.array(),
    brand: Joi.string(),
  }),
};

const getDiscussions = {
  query: Joi.object().keys({
    title: Joi.string(),
    category: Joi.string(),
    subCategory: Joi.string(),
    user: Joi.string().custom(objectId),
    status: Joi.string().regex(/^[^4]*$/),
    brand: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.string().custom(objectId),
  }),
};

const getDiscussionBySerialNumber = {
  params: Joi.object().keys({
    serialNumber: Joi.string(),
  }),
};

const updateDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('0', '1', '2', '3', '4'),
    })
    .min(1),
};

const deleteDiscussion = {
  params: Joi.object().keys({
    discussionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getDiscussionBySerialNumber,
};
