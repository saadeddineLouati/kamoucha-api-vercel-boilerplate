const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');

const createReport = catchAsync(async (req, res) => {
  const report = await reportService.createReport({ ...req.body, user: req.user?._id });
  res.status(httpStatus.CREATED).send(report);
});

const getReports = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postType', 'user', 'post', 'subject']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reportService.queryReports({ ...filter, user: req.user._id }, options);
  res.send(result);
});

module.exports = {
  createReport,
  getReports,
};
