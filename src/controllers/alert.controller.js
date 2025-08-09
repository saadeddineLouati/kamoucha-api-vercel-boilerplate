const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { alertService } = require('../services');

const createAlert = catchAsync(async (req, res) => {
  const alert = await alertService.createAlert({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(alert);
});

const getAlerts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'subCategory', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await alertService.queryAlerts({ ...filter, user: req.user._id }, options);
  res.send(result);
});

const getAlert = catchAsync(async (req, res) => {
  const alert = await alertService.getAlertById(req.params.alertId);
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alerte introuvable');
  }
  res.send(alert);
});

const updateAlert = catchAsync(async (req, res) => {
  const alert = await alertService.updateAlertById(req.params.alertId, req.body, req.user?._id);
  res.send(alert);
});

const deleteAlert = catchAsync(async (req, res) => {
  await alertService.deleteAlertById(req.params.alertId, req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAlert,
  getAlerts,
  getAlert,
  updateAlert,
  deleteAlert,
};
