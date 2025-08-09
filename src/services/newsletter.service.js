const httpStatus = require('http-status');
const Newsletter = require('../models/newsletter.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for newsletters
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNewsletters = async (filter, options) => {
  const newsletters = await Newsletter.paginate(filter, options);
  return newsletters;
};

/**
 * Create a newsletter
 * @param {Object} newsletterBody
 * @returns {Promise<Newsletter>}
 */
const createNewsletter = async (newsletterBody) => {
  const newsletter = await Newsletter.findOne({ email: newsletterBody.email });
  if (newsletter) {
    throw new ApiError(httpStatus.CONFLICT, 'Déjà inscrit');
  }
  return Newsletter.create(newsletterBody);
};

/**
 * Delete newsletter by id
 * @param {ObjectId} newsletterId
 * @returns {Promise<Newsletter>}
 */
const deleteNewsletterById = async (newsletterId) => {
  const newsletter = await Newsletter.findById(newsletterId);
  if (!newsletter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Newsletter not found');
  }
  await newsletter.remove();
  return newsletter;
};

module.exports.queryNewsletters = queryNewsletters;
module.exports.createNewsletter = createNewsletter;
module.exports.deleteNewsletterById = deleteNewsletterById;
