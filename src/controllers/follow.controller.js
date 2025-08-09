const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { followService } = require('../services');

const createFollow = catchAsync(async (req, res) => {
  const follow = await followService.createFollow({ ...req.body, follower: req.user._id });
  res.status(httpStatus.CREATED).send(follow);
});

const getFollows = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['follower', 'followed']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await followService.queryFollows(filter, options);
  res.send(result);
});

const unfollowUser = catchAsync(async (req, res) => {
  const follow = await followService.unfollow(req.params.userId, req.user?._id);
  if (!follow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Follow introuvable');
  }
  res.send(follow);
});

const getFollwers = catchAsync(async (req, res) => {
  const follow = await followService.getFollwers(req.params.userId);
  if (!follow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Follow introuvable');
  }
  res.send(follow.length());
});

const getFollowed = catchAsync(async (req, res) => {
  const follow = await followService.getFollowed(req.params.userId);
  if (!follow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Follow introuvable');
  }
  res.send(follow.length());
});

module.exports = {
  createFollow,
  getFollows,
  unfollowUser,
  getFollwers,
  getFollowed,
};
