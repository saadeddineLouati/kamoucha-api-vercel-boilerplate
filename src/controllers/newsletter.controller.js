const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { newsletterService } = require('../services');

const createNewsletter = catchAsync(async (req, res) => {
  const newsletter = await newsletterService.createNewsletter({ ...req.body, user: req.user?._id });
  res.status(httpStatus.CREATED).send(newsletter);
});

const getNewsletters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'subCategory', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await newsletterService.queryNewsletters({ ...filter, user: req.user._id }, options);
  res.send(result);
});

const deleteNewsletter = catchAsync(async (req, res) => {
  await newsletterService.deleteNewsletterById(req.params.newsletterId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNewsletter,
  getNewsletters,
  deleteNewsletter,
};
