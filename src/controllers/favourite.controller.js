const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { favouriteService } = require('../services');

const createFavourite = catchAsync(async (req, res) => {
  const favourite = await favouriteService.createFavourite(req.user._id, req.body);
  res.status(httpStatus.CREATED).send(favourite);
});

const getFavourites = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await favouriteService.queryFavourites(filter, options);
  res.send(result);
});

const getFavouriteByUser = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postType']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const favourite = await favouriteService.queryFavourites(
    { ...filter, user: req.user._id },
    { sortBy: 'created_at:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted,post' }
  );
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favori introuvable');
  }
  res.send(favourite);
});

const deleteFavourite = catchAsync(async (req, res) => {
  await favouriteService.deleteFavouriteById(req.params.post, req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteAllUserFavourites = catchAsync(async (req, res) => {
  await favouriteService.deleteAllUserFavourites(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFavourite,
  getFavourites,
  getFavouriteByUser,
  deleteFavourite,
  deleteAllUserFavourites,
};
