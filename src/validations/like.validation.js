const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createLike = {
  body: Joi.object().keys({
    post: Joi.string().custom(objectId).required(),
    postType: Joi.string().required(),
    type: Joi.string(),
  }),
};

const getLikes = {
  query: Joi.object().keys({
    user: Joi.string(),
    post: Joi.string(),
    postType: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteLike = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId).required(),
    type: Joi.string().required(),
  }),
};

module.exports = {
  createLike,
  getLikes,
  deleteLike,
};
