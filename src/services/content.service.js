const httpStatus = require('http-status');
const Content = require('../models/content.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for content
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryContent = async (filter, options) => {
  const content = await Content.paginate({ ...filter, status: 0 }, options);
  return content;
};

/**
 * Get content by id
 * @param {ObjectId} id
 * @returns {Promise<Content>}
 */
const getContentById = async (id) => {
  return Content.findById(id);
};

/**
 * Create a content
 * @param {Object} contentBody
 * @returns {Promise<Content>}
 */
const createContent = async (contentBody) => {
  return Content.create(contentBody);
};

/**
 * Update content by id
 * @param {ObjectId} contentId
 * @param {Object} updateBody
 * @returns {Promise<Content>}
 */
const updateContentById = async (contentId, updateBody) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contenu introuvable');
  }
  Object.assign(content, updateBody);
  await content.save();
  return content;
};

/**
 * Delete content by id
 * @param {ObjectId} contentId
 * @returns {Promise<Content>}
 */
const deleteContentById = async (contentId) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contenu introuvable');
  }
  await content.remove();
  return content;
};

module.exports.queryContent = queryContent;
module.exports.getContentById = getContentById;
module.exports.createContent = createContent;
module.exports.updateContentById = updateContentById;
module.exports.deleteContentById = deleteContentById;
