const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAddress = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    street: Joi.string().required(),
    postalCode: Joi.string(),
    addresscomplement: Joi.string(),
    town: Joi.string(),
    country: Joi.string(),
    phoneNumber: Joi.string(),
    metadata: Joi.object(),
  }),
};

const getAddresses = {
  query: Joi.object().keys({
    name: Joi.string(),
    street: Joi.string(),
    postalCode: Joi.string(),
    town: Joi.string(),
    country: Joi.string(),
    phoneNumber: Joi.string(),
    metadata: Joi.object(),
  }),
};

const getAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(objectId),
  }),
};

const updateAddress = {
  params: Joi.object().keys({
    addressId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      street: Joi.string(),
      postalCode: Joi.string(),
      town: Joi.string(),
      country: Joi.string(),
      phoneNumber: Joi.string(),
      metadata: Joi.object(),
      addresscomplement: Joi.string(),
    })
    .min(1),
};

const deleteAddress = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
};
