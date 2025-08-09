const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createContent = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    path: Joi.string(),
    category: Joi.string(),
    status: Joi.number(),
    content: Joi.object().required(),
  }),
};

const getContent = {
  query: Joi.object().keys({
    type: Joi.string(),
    path: Joi.string(),
    category: Joi.string(),
    status: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getContentByID = {
  params: Joi.object().keys({
    contentId: Joi.string().custom(objectId),
  }),
};

const updateContent = {
  params: Joi.object().keys({
    contentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      content: Joi.object(),
      status: Joi.number(),
    })
    .min(1),
};

const deleteContent = {
  params: Joi.object().keys({
    contentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createContent,
  getContentByID,
  getContent,
  updateContent,
  deleteContent,
};
