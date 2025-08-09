const Joi = require('joi');

const createContactMessage = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    subject: Joi.string().required(),
    message: Joi.string().required(),
    company: Joi.string(),
  }),
};

module.exports = {
  createContactMessage,
};
