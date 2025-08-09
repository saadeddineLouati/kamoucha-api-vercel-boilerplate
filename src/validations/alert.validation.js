const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAlert = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    subCategory: Joi.string(),
    category: Joi.string(),
  }),
};

const getAlerts = {
  query: Joi.object().keys({
    type: Joi.string(),
    subCategory: Joi.string(),
    category: Joi.string(),
  }),
};

const getAlert = {
  params: Joi.object().keys({
    alertId: Joi.string().custom(objectId),
  }),
};

const updateAlert = {
  params: Joi.object().keys({
    alertId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      type: Joi.string().required(),
      subCategory: Joi.string(),
      category: Joi.string(),
    })
    .min(1),
};

const deleteAlert = {
  params: Joi.object().keys({
    alertId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
};
