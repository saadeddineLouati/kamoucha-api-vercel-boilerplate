const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { boostService } = require('../services');

const createBoost = catchAsync(async (req, res) => {
  const boost = await boostService.createBoost({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(boost);
});

const getBoosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product', 'date', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await boostService.queryBoosts({ ...filter, user: req.user._id }, options);
  res.send(result);
});

const getBoost = catchAsync(async (req, res) => {
  const boost = await boostService.getBoostById(req.params.boostId);
  if (!boost) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Boost introuvable');
  }
  res.send(boost);
});

const getUpcomingBoostsDates = catchAsync(async (req, res) => {
  const boosts = await boostService.getUpcomingBoostsDates();
  res.send(boosts);
});

module.exports = {
  createBoost,
  getBoosts,
  getBoost,
  getUpcomingBoostsDates,
};
