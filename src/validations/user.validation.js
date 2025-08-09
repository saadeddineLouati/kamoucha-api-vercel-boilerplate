const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLeaderBoard = {
  query: Joi.object().keys({
    start: Joi.date(),
    end: Joi.date(),
    dateString: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserByName = {
  params: Joi.object().keys({
    name: Joi.string(),
  }),
};

const updateUser = {
  params: Joi.object().keys({}),
  body: Joi.object().keys({
    imgUrl: Joi.string().allow(''),
    backgroundImg: Joi.string().allow(''),
    firstname: Joi.string().allow(''),
    lastname: Joi.string().allow(''),
    phonenumber: Joi.string().allow(''),
    street: Joi.string().allow(''),
    postalCode: Joi.string().allow(''),
    city: Joi.string().allow(''),
    region: Joi.string().allow(''),
    country: Joi.string().allow(''),
    addresscomplement: Joi.string().allow(''),
    facebook: Joi.string().allow(''),
    instagram: Joi.string().allow(''),
    twitter: Joi.string().allow(''),
    youtube: Joi.string().allow(''),
    pushNotifications: Joi.boolean(),
    shareEmail: Joi.boolean(),
    sharePhone: Joi.boolean(),
    shareAddress: Joi.boolean(),
    notificationSubscriptions: Joi.array(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  deleteUser,
  getLeaderBoard,
};
