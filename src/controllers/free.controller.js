const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { freeService } = require('../services');
const clean = require('../utils/clean');
const { filterKeysToPick } = require('../config/const');

const createFree = catchAsync(async (req, res) => {
  const free = await freeService.createFree({
    ...req.body,
    user: req.user._id,
    isTrusted: req.user.isTrusted,
    score: req.user.isTrusted ? 10 : 0,
  });
  res.status(httpStatus.CREATED).send(free);
});

const getFrees = catchAsync(async (req, res) => {
  const filter = pick(req.query, filterKeysToPick);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await freeService.queryFrees(clean(filter), options);
  res.send(result);
});

const getFree = catchAsync(async (req, res) => {
  const free = await freeService.getFreeById(req.params.freeId, req.user?._id);
  if (!free) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gratuit introuvable');
  }
  res.send(free);
});

const getFreeBySerialNumber = catchAsync(async (req, res) => {
  const free = await freeService.getFreeBySerialNumber(
    req.params.serialNumber,
    req.user?._id,
    req.clientIp ? req.clientIp : req.ip
  );
  if (!free) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gratuit introuvable');
  }
  res.send(free);
});

const updateFree = catchAsync(async (req, res) => {
  const free = await freeService.updateFreeById(req.params.freeId, req.body, req.user?._id);
  res.send(free);
});

const deleteFree = catchAsync(async (req, res) => {
  await freeService.deleteFreeById(req.params.freeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFree,
  getFrees,
  getFree,
  updateFree,
  deleteFree,
  getFreeBySerialNumber,
};
