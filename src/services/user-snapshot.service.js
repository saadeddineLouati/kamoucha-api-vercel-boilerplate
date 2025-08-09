const { User } = require('../models');
const UserSnaphot = require('../models/user-snapshot.model');
const { formatDateToString } = require('../utils/vanilla');

/**
 * Query for user snapshots
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySnaphots = async (filter, options) => {
  options.sortBy = '-rank';
  if (!filter.dateString || filter.dateString === formatDateToString(new Date())) {
    options.sortBy = '-score';
    return User.paginate(filter, options);
  }
  const users = await UserSnaphot.paginate(filter, options);
  return users;
};

module.exports = {
  querySnaphots,
};
