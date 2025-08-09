const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getActivities = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    brand: Joi.string(),
    postType: Joi.string(),
    status: Joi.string().regex(/^[^4]*$/),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getActivities,
};
