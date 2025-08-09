const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSearch = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    query: Joi.object().required(),
    merchand: Joi.string(),
  }),
};

const getSearches = {
  query: Joi.object().keys({
    subCategory: Joi.string(),
    category: Joi.string(),
    type: Joi.string(),
    withNotifications: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSearch = {
  params: Joi.object().keys({
    searchId: Joi.string().custom(objectId),
  }),
};

const updateSearch = {
  params: Joi.object().keys({
    searchId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      type: Joi.string(),
      query: Joi.object(),
      withNotifications: Joi.boolean(),
    })
    .min(1),
};

const deleteSearch = {
  params: Joi.object().keys({
    searchId: Joi.string().custom(objectId),
  }),
};

const findByKeyWordAndPostType = {
  params: Joi.object().keys({
    postType: Joi.string(),
    keyword: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
  }),
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
  }),
};

const findByKeyWordAndPage = {
  params: Joi.object().keys({
    keyword: Joi.string(),
    page: Joi.string(),
  }),
};

module.exports = {
  createSearch,
  getSearches,
  getSearch,
  updateSearch,
  deleteSearch,
  findByKeyWordAndPostType,
  findByKeyWordAndPage,
};
