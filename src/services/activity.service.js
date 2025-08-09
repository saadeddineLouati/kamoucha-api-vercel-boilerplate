const Activity = require('../models/activity.model');

/**
 * Query for activities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryActivities = async (filter, options) => {
  const activities = await Activity.paginate(
    {
      $or: [{ status: '0' }, { status: '1' }, { status: '2' }, { status: '3' }],
      ...filter,
    },
    { sortBy: 'metadata.score:desc', ...options, populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted,post' }
  );
  return activities;
};

/**
 * Create a activity
 * @param {Object} activityBody
 * @returns {Promise<Activity>}
 */
const createActivity = async (activityBody) => {
  const newActivity = new Activity(activityBody);
  return newActivity.save();
};

module.exports.queryActivities = queryActivities;
module.exports.createActivity = createActivity;
