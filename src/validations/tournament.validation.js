const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTournament = {
  body: Joi.object().keys({
    type: Joi.string().required(),
    date: Joi.date().required(),
    product: Joi.string().custom(objectId).required(),
  }),
};

const getTournaments = {
  query: Joi.object().keys({
    type: Joi.string(),
    status: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    product: Joi.string().custom(objectId),
  }),
};

const getTournament = {
  params: Joi.object().keys({
    tournamentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTournament,
  getTournaments,
  getTournament,
};
