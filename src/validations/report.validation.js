const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReport = {
  body: Joi.object().keys({
    postType: Joi.string().required(),
    user: Joi.string().custom(objectId),
    post: Joi.string().custom(objectId).required(),
    subject: Joi.string().required(),
    description: Joi.string(),
  }),
};

const getReportes = {
  query: Joi.object().keys({
    postType: Joi.string(),
    user: Joi.string().custom(objectId),
    post: Joi.string().custom(objectId),
    subject: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createReport,
  getReportes,
};
