const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNewsletter = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const getNewsletteres = {
  query: Joi.object().keys({
    email: Joi.string().email(),
  }),
};

const deleteNewsletter = {
  params: Joi.object().keys({
    newsletterId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createNewsletter,
  getNewsletteres,
  deleteNewsletter,
};
