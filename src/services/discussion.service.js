const he = require('he');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const Discussion = require('../models/discussion.model');
const Visit = require('../models/visit.model');
const ApiError = require('../utils/ApiError');
const { getPostScore } = require('../utils/scoreComputing');
const { postStatus } = require('../config/const');
const Activity = require('../models/activity.model');

/**
 * Query for discussions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDiscussions = async (filter, options) => {
  const discussions = await Discussion.paginate(
    { status: postStatus.published, ...filter },
    { sortBy: 'score:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted' }
  );
  return discussions;
};

/**
 * Get discussion by id
 * @param {ObjectId} id
 * @returns {Promise<Discussion>}
 */
const getDiscussionById = async (id) => {
  return Discussion.findById(id).populate('user', { name: 1, imgUrl: 1, backgroundImg: 1, isTrusted: 1, isDeleted: 1 });
};

/**
 * Get discussion by id
 * @param {ObjectId} id
 * @returns {Promise<Discussion>}
 */
const getDiscussionBySerialNumber = async (serialNumber, user, ip) => {
  const discussion = await Discussion.findOne({ serialNumber, status: { $ne: postStatus.deleted } }).populate('user', {
    name: 1,
    imgUrl: 1,
    backgroundImg: 1,
    isTrusted: 1,
    isDeleted: 1,
    _id: 1,
  });
  if (!discussion || (discussion.status !== postStatus.published && String(user) !== String(discussion.user._id))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion introuvable');
  }
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const existingVisits = await Visit.find({ ip, post: discussion._id, created_at: { $gte: oneHourAgo } });
  if (!existingVisits.length) {
    let totalViews = discussion.totalViews || 0;
    totalViews += 1;
    const score = getPostScore(discussion);
    const discussionId = new mongoose.Types.ObjectId(discussion._id);
    await Discussion.findByIdAndUpdate(discussionId.toString(), { totalViews, score });
    await Visit.create({
      user,
      post: discussion._id,
      postType: 'Discussion',
      isAnonym: !user,
      ip,
    });
  }
  const suggestions = await this.getSuggestions(discussion);
  return { result: discussion, suggestions };
};

/**
 * Create a discussion
 * @param {Object} discussionBody
 * @returns {Promise<Discussion>}
 */
const createDiscussion = async (discussionBody) => {
  const discussionToBecreated = discussionBody;
  if (discussionBody.description) discussionToBecreated.description = he.decode(discussionBody.description);
  return Discussion.create(discussionToBecreated);
};

/**
 * Update discussion by id
 * @param {ObjectId} discussionId
 * @param {Object} updateBody
 * @returns {Promise<Discussion>}
 */
const updateDiscussionById = async (discussionId, updateBody, user) => {
  const discussion = await getDiscussionById(discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion introuvable');
  }
  if (String(discussion.user?._id) !== String(user)) throw new ApiError(httpStatus.FORBIDDEN, `Interdit`);

  if (updateBody.status === postStatus.banned) throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (
    discussion.status === postStatus.unpublished &&
    updateBody.status !== postStatus.published &&
    updateBody.status !== postStatus.deleted
  )
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');
  if (discussion.status === postStatus.expired && updateBody.status !== postStatus.deleted)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (discussion.status === postStatus.deleted || discussion.status === postStatus.banned)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (updateBody.status) {
    await Activity.findOneAndUpdate(
      { post: discussion._id },
      {
        status: updateBody.status,
      },
      { new: true } // return updated post
    );
  }

  return Discussion.findByIdAndUpdate(discussion._id, Object.assign(discussion, updateBody));
};

/**
 * Delete discussion by id
 * @param {ObjectId} discussionId
 * @returns {Promise<Discussion>}
 */
const deleteDiscussionById = async (discussionId) => {
  const discussion = await getDiscussionById(discussionId);
  if (!discussion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Discussion introuvable');
  }
  await discussion.remove();
  return discussion;
};

/**
 * Get suggestions array by discussion
 * @param {String} region
 * @returns {Promise<Deal>}
 */
const getSuggestions = async (discussion) => {
  let results = await Discussion.find({ status: '0', category: discussion.category, _id: { $ne: discussion._id } })
    .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
    .sort('-score')
    .limit(10);
  if (results.length < 3)
    results = await Discussion.find({ status: '0', _id: { $ne: discussion._id } })
      .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
      .sort('-score')
      .limit(10);
  return results;
};

module.exports.queryDiscussions = queryDiscussions;
module.exports.getDiscussionById = getDiscussionById;
module.exports.createDiscussion = createDiscussion;
module.exports.updateDiscussionById = updateDiscussionById;
module.exports.deleteDiscussionById = deleteDiscussionById;
module.exports.getDiscussionBySerialNumber = getDiscussionBySerialNumber;
module.exports.getSuggestions = getSuggestions;
