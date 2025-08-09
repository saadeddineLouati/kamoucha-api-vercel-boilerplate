const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { catalogueService } = require('../services');
const ApiError = require('../utils/ApiError');

const getCatalogues = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['merchand']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.select = { images: 1, merchand: 1, category: 1, createdAt: 1, updatedAt: 1, label: 1 };
  options.sortBy = '-createdAt';
  const result = await catalogueService.queryCatalogues(filter, options);
  res.send(result);
});

const getCatalogue = catchAsync(async (req, res) => {
  const catalogue = await catalogueService.getCatalogueById(
    req.params.catalogueId,
    req.user?._id,
    req.clientIp ? req.clientIp : req.ip
  );
  if (!catalogue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }
  res.send(catalogue);
});

const createCatalogue = catchAsync(async (req, res) => {
  const catalogue = await catalogueService.createCatalogue({
    ...req.body,
  });
  res.status(httpStatus.CREATED).send(catalogue);
});

module.exports = {
  getCatalogues,
  getCatalogue,
  createCatalogue,
};
