const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { searchService } = require('../services');
const { engineService } = require('../services');

const createSearch = catchAsync(async (req, res) => {
  const search = await searchService.createSearch({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(search);
});

const getSearches = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['subCategory', 'category', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await searchService.querySearches(
    { ...filter, user: req.user._id },
    { sortBy: 'created_at:desc', ...options }
  );
  res.send(result);
});

const getSearch = catchAsync(async (req, res) => {
  const search = await searchService.getSearchById(req.params.searchId);
  if (!search) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recherche introuvable');
  }
  res.send(search);
});

const updateSearch = catchAsync(async (req, res) => {
  const search = await searchService.updateSearchById(req.params.searchId, req.body, req.user?._id);
  res.send(search);
});

const deleteSearch = catchAsync(async (req, res) => {
  await searchService.deleteSearchById(req.params.searchId, req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

const findByKeyWordAndPostType = catchAsync(async (req, res) => {
  const result = await engineService.findByKeyWordAndPostType(
    req.params.keyword,
    req.params.postType,
    req.query.sortBy,
    req.query.page,
    req.query.limit,
    req.user?._id
  );
  res.send(result);
});

const findByKeyWord = catchAsync(async (req, res) => {
  const result = await engineService.findByKeyWord(req.params.keyword, req.params.page);
  res.send(result);
});

const deleteAllUserSearchess = catchAsync(async (req, res) => {
  await searchService.deleteAllUserSearches(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSearch,
  getSearches,
  getSearch,
  updateSearch,
  deleteSearch,
  findByKeyWordAndPostType,
  deleteAllUserSearchess,
  findByKeyWord,
};
