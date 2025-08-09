const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { dealService } = require('../services');
const clean = require('../utils/clean');
const { filterKeysToPick } = require('../config/const');

const createDeal = catchAsync(async (req, res) => {
  const deal = await dealService.createDeal({
    ...req.body,
    user: req.user._id,
    isTrusted: req.user.isTrusted,
    score: req.user.isTrusted ? 0.9 : 0,
  });
  res.status(httpStatus.CREATED).send(deal);
});

const getDeals = catchAsync(async (req, res) => {
  const filter = pick(req.query, filterKeysToPick);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await dealService.queryDeals(clean(filter), options);
  res.send(result);
});

const getDeal = catchAsync(async (req, res) => {
  const deal = await dealService.getDealById(req.params.dealId, req.user?._id);
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }
  res.send(deal);
});

const getDealBySerialNumber = catchAsync(async (req, res) => {
  const deal = await dealService.getDealBySerialNumber(
    req.params.serialNumber,
    req.user?._id,
    req.clientIp ? req.clientIp : req.ip
  );
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }
  res.send(deal);
});

const updateDeal = catchAsync(async (req, res) => {
  const deal = await dealService.updateDealById(req.params.dealId, req.body, req.user?._id);
  res.send(deal);
});

const deleteDeal = catchAsync(async (req, res) => {
  await dealService.deleteDealById(req.params.dealId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  getDealBySerialNumber,
};
