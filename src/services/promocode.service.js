const he = require('he');
const httpStatus = require('http-status');
const mongoose = require('mongoose');
const PromoCode = require('../models/promocode.model');
const Visit = require('../models/visit.model');
const ApiError = require('../utils/ApiError');
const { getPostScore } = require('../utils/scoreComputing');
const { postStatus } = require('../config/const');
const Activity = require('../models/activity.model');

/**
 * Query for promoCodes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPromoCodes = async (filter, options, user) => {
  const promoCodes = await PromoCode.paginate(
    { $or: [{ status: postStatus.published }, { status: postStatus.expired }], ...filter },
    { sortBy: 'score:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted' }
  );
  const newPromoCodes = promoCodes.results;
  if (newPromoCodes && !user) {
    newPromoCodes.forEach((element) => {
      element.promoCode = undefined;
    });
    promoCodes.results = newPromoCodes;
  }
  return promoCodes;
};

/**
 * Get promoCode by id
 * @param {ObjectId} id
 * @returns {Promise<PromoCode>}
 */
const getPromoCodeById = async (id) => {
  return PromoCode.findById(id).populate('user', { name: 1, imgUrl: 1, backgroundImg: 1, isTrusted: 1, isDeleted: 1 });
};

/**
 * Get promoCode by id
 * @param {ObjectId} id
 * @returns {Promise<PromoCode>}
 */
const getPromoCodeBySerialNumber = async (serialNumber, user, ip) => {
  const promoCode = await PromoCode.findOne({ serialNumber, status: { $ne: postStatus.deleted } }).populate('user', {
    name: 1,
    imgUrl: 1,
    backgroundImg: 1,
    isTrusted: 1,
    isDeleted: 1,
    _id: 1,
  });
  if (!promoCode || (promoCode.status !== postStatus.published && String(user) !== String(promoCode.user._id))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Code promo non trouvé');
  }
  if (!user) promoCode.promoCode = undefined;
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const existingVisits = await Visit.find({ ip, post: promoCode._id, created_at: { $gte: oneHourAgo } });
  if (!existingVisits.length) {
    let totalViews = promoCode.totalViews || 0;
    totalViews += 1;
    const score = getPostScore(promoCode);
    const promoCodeId = new mongoose.Types.ObjectId(promoCode._id);
    await PromoCode.findByIdAndUpdate(promoCodeId.toString(), { totalViews, score });
    await Visit.create({
      user,
      post: promoCode._id,
      postType: 'PromoCode',
      isAnonym: !user,
      ip,
    });
  }
  const result = { result: promoCode };
  if (promoCode.region) result.geoSuggestions = await this.getGeoSuggestions(promoCode);
  result.suggestions = await this.getSuggestions(promoCode);
  return result;
};

/**
 * Create a promoCode
 * @param {Object} promoCodeBody
 * @returns {Promise<PromoCode>}
 */
const createPromoCode = async (promoCodeBody) => {
  const promoCodeToBecreated = promoCodeBody;
  if (promoCodeBody.description) promoCodeToBecreated.description = he.decode(promoCodeBody.description);
  return PromoCode.create(promoCodeToBecreated);
};

/**
 * Update promoCode by id
 * @param {ObjectId} promoCodeId
 * @param {Object} updateBody
 * @returns {Promise<PromoCode>}
 */
const updatePromoCodeById = async (promoCodeId, updateBody, user) => {
  const promoCode = await getPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Code promo non trouvé');
  }
  if (String(promoCode.user?._id) !== String(user)) throw new ApiError(httpStatus.FORBIDDEN, `Interdit`);

  if (updateBody.status === postStatus.banned) throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (
    promoCode.status === postStatus.unpublished &&
    updateBody.status !== postStatus.published &&
    updateBody.status !== postStatus.deleted
  )
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (promoCode.status === postStatus.expired && updateBody.status !== postStatus.deleted)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (promoCode.status === postStatus.deleted || promoCode.status === postStatus.banned)
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');

  if (updateBody.status)
    await Activity.findOneAndUpdate(
      { post: promoCode._id },
      {
        $set: {
          status: updateBody.status,
        },
      },
      { new: true } // return updated post
    );
  return PromoCode.findByIdAndUpdate(promoCode._id, Object.assign(promoCode, updateBody));
};

/**
 * Delete promoCode by id
 * @param {ObjectId} promoCodeId
 * @returns {Promise<PromoCode>}
 */
const deletePromoCodeById = async (promoCodeId) => {
  const promoCode = await getPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Code promo non trouvé');
  }
  await promoCode.remove();
  return promoCode;
};

/**
 * Get getGeoSuggestions array by promoCode
 * @param {String} region
 * @returns {Promise<PromoCode>}
 */
const getGeoSuggestions = async (promoCode) => {
  return PromoCode.find({ status: '0', region: promoCode.region, _id: { $ne: promoCode._id } })
    .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
    .sort('-score')
    .limit(10);
};

/**
 * Get suggestions array by promoCode
 * @param {String} region
 * @returns {Promise<PromoCode>}
 */
const getSuggestions = async (promoCode) => {
  let results = await PromoCode.find({ status: '0', category: promoCode.category, _id: { $ne: promoCode._id } })
    .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
    .sort('-score')
    .limit(10);

  if (results.length < 3)
    results = await PromoCode.find({ status: '0', _id: { $ne: promoCode._id } })
      .populate('user', '_id imgUrl name backgroundImg isDeleted isTrusted')
      .sort('-score')
      .limit(10);
  return results;
};

module.exports.queryPromoCodes = queryPromoCodes;
module.exports.getPromoCodeById = getPromoCodeById;
module.exports.createPromoCode = createPromoCode;
module.exports.updatePromoCodeById = updatePromoCodeById;
module.exports.deletePromoCodeById = deletePromoCodeById;
module.exports.getPromoCodeBySerialNumber = getPromoCodeBySerialNumber;
module.exports.getGeoSuggestions = getGeoSuggestions;
module.exports.getSuggestions = getSuggestions;
