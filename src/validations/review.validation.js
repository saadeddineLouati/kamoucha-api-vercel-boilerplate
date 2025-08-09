const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    product: Joi.string().custom(objectId).required(),
    vendor: Joi.string().custom(objectId),
    type: Joi.string().required(),
    value: Joi.number().required(),
    comment: Joi.string().required(),
    metadata: Joi.object(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    product: Joi.string().custom(objectId),
    user: Joi.string().custom(objectId),
    vendor: Joi.string().custom(objectId),
    type: Joi.string(),
    value: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      product: Joi.string().custom(objectId).required(),
      user: Joi.string().custom(objectId).required(),
      vendor: Joi.string().custom(objectId),
      type: Joi.string().required(),
      value: Joi.number().required(),
      comment: Joi.string(),
      metadata: Joi.object(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
