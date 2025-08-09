const Boost = require('../models/boost.model');
const { dateWithoutTime } = require('../utils/dates');

/**
 * Query for boosts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBoosts = async (filter, options) => {
  const boosts = await Boost.paginate(filter, options);
  return boosts;
};

/**
 * Get boost by id
 * @param {ObjectId} id
 * @returns {Promise<Boost>}
 */
const getBoostById = async (id) => {
  return Boost.findById(id);
};

/**
 * Create a boost
 * @param {Object} boostBody
 * @returns {Promise<Boost>}
 */
const createBoost = async (boostBody) => {
  return Boost.create(boostBody);
};

/**
 * Get upcoming boosts dates
 * @param {ObjectId} id
 * @returns {Promise<Boost>}
 */
const getUpcomingBoostsDates = async () => {
  const boosts = await Boost.find({ date: { $gte: dateWithoutTime() } });
  return boosts;
};

module.exports.queryBoosts = queryBoosts;
module.exports.getBoostById = getBoostById;
module.exports.createBoost = createBoost;
module.exports.getUpcomingBoostsDates = getUpcomingBoostsDates;
