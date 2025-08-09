/* eslint-disable security/detect-unsafe-regex */
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPromocode = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    type: Joi.string().required(),
    link: Joi.string().regex(/^(?!https?:\/\/)(www\.)?[a-z0-9]+([-.\s][a-z0-9]+)*\.[a-z]{2,}([/?#][^\s]*)?$/i),
    value: Joi.number(),
    promoCode: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    images: Joi.array(),
    image: Joi.string(),
    description: Joi.string().required(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    noExpiration: Joi.boolean(),
    region: Joi.string(),
    city: Joi.string(),
    tags: Joi.array(),
    brand: Joi.string(),
  }),
};

const getPromocodes = {
  query: Joi.object().keys({
    title: Joi.string(),
    type: Joi.string(),
    link: Joi.string(),
    value: Joi.number(),
    category: Joi.string(),
    subCategory: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    noExpiration: Joi.boolean(),
    region: Joi.string(),
    city: Joi.string(),
    tags: Joi.array(),
    user: Joi.string().custom(objectId),
    status: Joi.string().regex(/^[^4]*$/),
    isCommented: Joi.boolean(),
    hideExpired: Joi.boolean(),
    brand: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPromocode = {
  params: Joi.object().keys({
    promocodeId: Joi.string().custom(objectId),
  }),
};

const getPromoCodeBySerialNumber = {
  params: Joi.object().keys({
    serialNumber: Joi.string(),
  }),
};

const updatePromocode = {
  params: Joi.object().keys({
    promocodeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      status: Joi.string().valid('0', '1', '2', '3', '4'),
    })
    .min(1),
};

const deletePromocode = {
  params: Joi.object().keys({
    promocodeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPromocode,
  getPromocodes,
  getPromocode,
  updatePromocode,
  deletePromocode,
  getPromoCodeBySerialNumber,
};
