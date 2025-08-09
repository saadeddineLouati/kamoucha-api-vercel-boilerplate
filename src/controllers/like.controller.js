const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { likeService } = require('../services');

const createLike = catchAsync(async (req, res) => {
  await likeService.createLike({ ...req.body, user: req.user._id });
  res.status(httpStatus.NO_CONTENT).send();
});

const getLikes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['post', 'user', 'postType', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await likeService.queryLikes(filter, options);
  res.send(result);
});

const deleteLike = catchAsync(async (req, res) => {
  await likeService.deleteLike(req.params.postId, req.user?.id, req.params?.type);
  res.status(httpStatus.NO_CONTENT).send();
});

const likeHandler = catchAsync(async (req, res) => {
  await likeService.likeHandler({ ...req.body, user: req.user?._id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLike,
  getLikes,
  deleteLike,
  likeHandler,
};
