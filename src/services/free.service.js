const he = require('he');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const Free = require('../models/free.model');
const Visit = require('../models/visit.model');
const ApiError = require('../utils/ApiError');
const { getPostScore } = require('../utils/scoreComputing');
const { postStatus } = require('../config/const');
const Activity = require('../models/activity.model');

/**
 * Query for frees
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFrees = async (filter, options) => {
  const frees = await Free.paginate(
    { status: postStatus.published, ...filter },
    { sortBy: 'score:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted' }
  );
  return frees;
};

/**
 * Get free by id
 * @param {ObjectId} id
 * @returns {Promise<Free>}
 */
const getFreeById = async (id) => {
  return Free.findById(id).populate('user', { name: 1, imgUrl: 1, backgroundImg: 1, isTrusted: 1, isDeleted: 1 });
};

/**
 * Get free by id
 * @param {ObjectId} id
 * @returns {Promise<Free>}
 */
const getFreeBySerialNumber = async (serialNumber, user, ip) => {
  const free = await Free.findOne({ serialNumber, status: { $ne: postStatus.deleted } }).populate('user', {
    _id: 1,
    name: 1,
    imgUrl: 1,
    backgroundImg: 1,
    isTrusted: 1,
    isDeleted: 1,
  });
  if (!free || (free.status !== postStatus.published && String(user) !== String(free.user._id))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gratuit introuvable');
  }
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const existingVisits = await Visit.find({ ip, post: free._id, created_at: { $gte: oneHourAgo } });
  if (!existingVisits.length) {
    let totalViews = free.totalViews || 0;
    totalViews += 1;
    const score = getPostScore(free);
    const freeId = new mongoose.Types.ObjectId(free._id);
    await Free.findOneAndUpdate(freeId.toString(), { totalViews, score });
    await Visit.create({
      user,
      post: free._id,
      postType: 'Free',
      isAnonym: !user,
      ip,
    });
  }
  const result = { result: free };
  if (free.region) result.geoSuggestions = await this.getGeoSuggestions(free);
  result.suggestions = await this.getSuggestions(free);
  return result;
};

/**
 * Create a free
 * @param {Object} freeBody
 * @returns {Promise<Free>}
 */
const createFree = async (freeBody) => {
  const freeToBecreated = freeBody;
  if (freeBody.description) freeToBecreated.description = he.decode(freeBody.description);
  return Free.create(freeToBecreated);
};

/**
 * Update free by id
 * @param {ObjectId} freeId
 * @param {Object} updateBody
 * @returns {Promise<Free>}
 */
const updateFreeById = async (freeId, updateBody, user) => {
  const free = await getFreeById(freeId);
  if (!free) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gratuit introuvable');
  }
  if (String(free.user?._id) !== String(user)) throw new ApiError(httpStatus.FORBIDDEN, `Interdit`);

  if (updateBody.status === postStatus.banned) throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (
    free.status === postStatus.unpublished &&
    updateBody.status !== postStatus.published &&
    updateBody.status !== postStatus.deleted
  )
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (free.status === postStatus.expired && updateBody.status !== postStatus.deleted)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (free.status === postStatus.deleted || free.status === postStatus.banned)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (updateBody.status)
    await Activity.findOneAndUpdate(
      { post: free._id },
      {
        $set: {
          status: updateBody.status,
        },
      },
      { new: true } // return updated post
    );
  return Free.findByIdAndUpdate(free._id, Object.assign(free, updateBody));
};

/**
 * Delete free by id
 * @param {ObjectId} freeId
 * @returns {Promise<Free>}
 */
const deleteFreeById = async (freeId) => {
  const free = await getFreeById(freeId);
  if (!free) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gratuit introuvable');
  }
  await free.remove();
  return free;
};

/**
 * Get getGeoSuggestions array by free
 * @param {String} region
 * @returns {Promise<Free>}
 */
const getGeoSuggestions = async (free) => {
  return Free.find({ status: '0', region: free.region, _id: { $ne: free._id } })
    .sort('-score')
    .limit(10);
};

/**
 * Get suggestions array by free
 * @param {String} region
 * @returns {Promise<Free>}
 */
const getSuggestions = async (free) => {
  let results = await Free.find({ status: '0', category: free.category, _id: { $ne: free._id } })
    .sort('-score')
    .limit(10);

  if (results.length < 3)
    results = await Free.find({ status: '0', _id: { $ne: free._id } })
      .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
      .sort('-score')
      .limit(10);
  return results;
};

module.exports.queryFrees = queryFrees;
module.exports.getFreeById = getFreeById;
module.exports.createFree = createFree;
module.exports.updateFreeById = updateFreeById;
module.exports.deleteFreeById = deleteFreeById;
module.exports.getFreeBySerialNumber = getFreeBySerialNumber;
module.exports.getGeoSuggestions = getGeoSuggestions;
module.exports.getSuggestions = getSuggestions;
