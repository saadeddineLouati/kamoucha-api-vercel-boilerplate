const Visit = require('../models/visit.model');

/**
 * Query for visits
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVisits = async (filter, options) => {
  const visits = await Visit.paginate(filter, options);
  return visits;
};

/**
 * Create a visit
 * @param {Object} visitBody
 * @returns {Promise<Visit>}
 */
const createVisit = async (visitBody) => {
  return Visit.create(visitBody);
};

module.exports.queryVisits = queryVisits;
module.exports.createVisit = createVisit;
