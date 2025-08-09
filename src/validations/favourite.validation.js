const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFavourite = {
  body: Joi.object().keys({
    post: Joi.string().custom(objectId).required(),
    postType: Joi.string().required(),
  }),
};

const getFavouriteByUser = {
  params: Joi.object().keys({
    user: Joi.string().custom(objectId),
  }),
};

const deleteFavourite = {
  params: Joi.object().keys({
    post: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createFavourite,
  getFavouriteByUser,
  deleteFavourite,
};
