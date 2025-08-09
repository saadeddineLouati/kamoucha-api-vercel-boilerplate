const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { visitService } = require('../services');

const createVisit = catchAsync(async (req, res) => {
  const visit = await visitService.createVisit({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(visit);
});

const getVisits = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'user', 'product', 'vendor']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await visitService.queryVisits({ ...filter, user: req.user._id }, options);
  res.send(result);
});

module.exports = {
  createVisit,
  getVisits,
};
