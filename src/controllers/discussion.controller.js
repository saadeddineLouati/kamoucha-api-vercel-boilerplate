const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { discussionService } = require('../services');
const clean = require('../utils/clean');
const { filterKeysToPick } = require('../config/const');

const createDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.createDiscussion({
    ...req.body,
    user: req.user._id,
    isTrusted: req.user.isTrusted,
    score: req.user.isTrusted ? 10 : 0,
  });
  res.status(httpStatus.CREATED).send(discussion);
});

const getDiscussions = catchAsync(async (req, res) => {
  const filter = pick(req.query, filterKeysToPick);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await discussionService.queryDiscussions(clean(filter), options);
  res.send(result);
});

const getDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionById(req.params.discussionId, req.user?._id);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion introuvable');
  }
  res.send(discussion);
});

const getDiscussionBySerialNumber = catchAsync(async (req, res) => {
  const discussion = await discussionService.getDiscussionBySerialNumber(
    req.params.serialNumber,
    req.user?._id,
    req.clientIp ? req.clientIp : req.ip
  );
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion introuvable');
  }
  res.send(discussion);
});

const updateDiscussion = catchAsync(async (req, res) => {
  const discussion = await discussionService.updateDiscussionById(req.params.discussionId, req.body, req.user?._id);
  res.send(discussion);
});

const deleteDiscussion = catchAsync(async (req, res) => {
  await discussionService.deleteDiscussionById(req.params.discussionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createDiscussion,
  getDiscussions,
  getDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getDiscussionBySerialNumber,
};
