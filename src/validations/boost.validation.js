const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBoost = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    date: Joi.date().required(),
    product: Joi.string().custom(objectId).required(),
  }),
};

const getBoosts = {
  query: Joi.object().keys({
    type: Joi.string(),
    date: Joi.date(),
    product: Joi.string().custom(objectId),
  }),
};

const getBoost = {
  params: Joi.object().keys({
    boostId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBoost,
  getBoosts,
  getBoost,
};
