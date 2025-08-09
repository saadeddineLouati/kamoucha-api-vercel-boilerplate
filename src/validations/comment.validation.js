const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createComment = {
  body: Joi.object().keys({
    post: Joi.string().custom(objectId).required(),
    postType: Joi.string().required(),
    value: Joi.number(),
    comment: Joi.string().required(),
    metadata: Joi.object(),
  }),
};

const getComments = {
  query: Joi.object().keys({
    user: Joi.string(),
    post: Joi.string(),
    postType: Joi.string(),
    value: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      user: Joi.string().custom(objectId).required(),
      post: Joi.string().custom(objectId).required(),
      postType: Joi.string().required(),
      value: Joi.number().required(),
      comment: Joi.string().required(),
      metadata: Joi.object(),
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
