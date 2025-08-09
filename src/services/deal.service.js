const he = require('he');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const Deal = require('../models/deal.model');
const Visit = require('../models/visit.model');
const ApiError = require('../utils/ApiError');
const { getPostScore } = require('../utils/scoreComputing');
const { postStatus } = require('../config/const');
const Activity = require('../models/activity.model');

/**
 * Query for deals
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDeals = async (filter, options) => {
  const deals = await Deal.paginate(
    { $or: [{ status: postStatus.published }, { status: postStatus.expired }], ...filter },
    { sortBy: 'score:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted' }
  );
  return deals;
};

/**
 * Get deal by id
 * @param {ObjectId} id
 * @returns {Promise<Deal>}
 */
const getDealById = async (id) => {
  return Deal.findById(id).populate('user', { name: 1, imgUrl: 1, backgroundImg: 1, isTrusted: 1, isDeleted: 1 });
};

/**
 * Get deal by id
 * @param {ObjectId} id
 * @returns {Promise<Deal>}
 */
const getDealBySerialNumber = async (serialNumber, user, ip) => {
  const deal = await Deal.findOne({ serialNumber, status: { $ne: postStatus.deleted } }).populate('user', {
    name: 1,
    imgUrl: 1,
    backgroundImg: 1,
    isTrusted: 1,
    isDeleted: 1,
  });
  if (!deal || (deal.status !== postStatus.published && String(user) !== String(deal.user._id))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const existingVisits = await Visit.find({ ip, post: deal._id, created_at: { $gte: oneHourAgo } });
  if (!existingVisits.length) {
    let totalViews = deal.totalViews || 0;
    totalViews += 1;
    const score = getPostScore(deal);
    const dealId = new mongoose.Types.ObjectId(deal._id);
    await Deal.findByIdAndUpdate(dealId.toString(dealId), { totalViews, score });
    await Visit.create({
      user,
      post: deal._id,
      postType: 'Deal',
      isAnonym: !user,
      ip,
    });
  }
  const result = { result: deal };
  if (deal.region) result.geoSuggestions = await this.getGeoSuggestions(deal);
  result.suggestions = await this.getSuggestions(deal);
  return result;
};

/**
 * Create a deal
 * @param {Object} dealBody
 * @returns {Promise<Deal>}
 */
const createDeal = async (dealBody) => {
  const dealToBecreated = dealBody;
  if (dealBody.description) dealToBecreated.description = he.decode(dealBody.description);
  return Deal.create(dealToBecreated);
};

/**
 * Update deal by id
 * @param {ObjectId} dealId
 * @param {Object} updateBody
 * @returns {Promise<Deal>}
 */
const updateDealById = async (dealId, updateBody, user) => {
  const deal = await getDealById(dealId);
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }

  if (String(deal.user?._id) !== String(user)) throw new ApiError(httpStatus.FORBIDDEN, `Interdit`);

  if (updateBody.status === postStatus.banned) throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (
    deal.status === postStatus.unpublished &&
    updateBody.status !== postStatus.published &&
    updateBody.status !== postStatus.deleted
  )
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (deal.status === postStatus.expired && updateBody.status !== postStatus.deleted)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (deal.status === postStatus.deleted || deal.status === postStatus.banned)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (updateBody.status) {
    await Activity.findOneAndUpdate(
      { post: deal._id },
      {
        status: updateBody.status,
      },
      { new: true } // return updated post
    );
  }
  return Deal.findByIdAndUpdate(deal._id, Object.assign(deal, updateBody));
};

/**
 * Delete deal by id
 * @param {ObjectId} dealId
 * @returns {Promise<Deal>}
 */
const deleteDealById = async (dealId) => {
  const deal = await getDealById(dealId);
  if (!deal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bon plan introuvable');
  }
  await deal.remove();
  return deal;
};

/**
 * Get getGeoSuggestions array by deal
 * @param {String} region
 * @returns {Promise<Deal>}
 */
const getGeoSuggestions = async (deal) => {
  return Deal.find({ status: '0', region: deal.region, _id: { $ne: deal._id } })
    .sort('-score')
    .limit(10);
};

/**
 * Get suggestions array by deal
 * @param {String} region
 * @returns {Promise<Deal>}
 */
const getSuggestions = async (deal) => {
  let results = await Deal.find({ status: '0', category: deal.category, _id: { $ne: deal._id } })
    .sort('-score')
    .limit(10);

  if (results.length < 3)
    results = await Deal.find({ status: '0', _id: { $ne: deal._id } })
      .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
      .sort('-score')
      .limit(10);
  return results;
};

module.exports.queryDeals = queryDeals;
module.exports.getDealById = getDealById;
module.exports.createDeal = createDeal;
module.exports.updateDealById = updateDealById;
module.exports.deleteDealById = deleteDealById;
module.exports.getDealBySerialNumber = getDealBySerialNumber;
module.exports.getGeoSuggestions = getGeoSuggestions;
module.exports.getSuggestions = getSuggestions;
