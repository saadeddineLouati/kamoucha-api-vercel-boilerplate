const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getCatalogues = {
  query: Joi.object().keys({
    merchand: Joi.string(),
  }),
};

const getCatalogue = {
  params: Joi.object().keys({
    catalogueId: Joi.string().custom(objectId),
  }),
};

const createCatalogue = {
  body: Joi.object().keys({
    merchand: Joi.string().required(),
    category: Joi.string().required(),
    label: Joi.string(),
    images: Joi.array().required(),
  }),
};

module.exports = {
  getCatalogues,
  getCatalogue,
  createCatalogue,
};
