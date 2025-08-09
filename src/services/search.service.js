const httpStatus = require('http-status');
const Search = require('../models/search.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for searches
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySearches = async (filter, options) => {
  const searches = await Search.paginate(filter, options);
  return searches;
};

/**
 * Get search by id
 * @param {ObjectId} id
 * @returns {Promise<Search>}
 */
const getSearchById = async (id) => {
  return Search.findById(id);
};

/**
 * Create a search
 * @param {Object} searchBody
 * @returns {Promise<Search>}
 */
const createSearch = async (searchBody) => {
  const query = { type: searchBody.type, user: searchBody.user, merchand: searchBody?.merchand };
  if (searchBody.query && Object.keys(searchBody.query).length) query.query = searchBody.query;
  const searchs = await Search.find(query);
  if (searchs.length) throw new ApiError(httpStatus.CONFLICT, 'Recherche déjà enregistrée');
  return Search.create(searchBody);
};

/**
 * Update search by id
 * @param {ObjectId} searchId
 * @param {Object} updateBody
 * @returns {Promise<Search>}
 */
const updateSearchById = async (searchId, updateBody, user) => {
  const search = await Search.findOne({ _id: searchId, user });
  if (!search) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recherche introuvable');
  }
  Object.assign(search, updateBody);
  await search.save();
  return search;
};

/**
 * Delete search by id
 * @param {ObjectId} searchId
 * @returns {Promise<Search>}
 */
const deleteSearchById = async (searchId, user) => {
  const search = await Search.findOne({ _id: searchId, user });
  if (!search) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Recherche introuvable');
  }
  await search.remove();
  return search;
};

/**
 * Delete all user searches
 * @param {ObjectId} user
 * @returns {Promise<Favourite>}
 */
const deleteAllUserSearches = async (user) => {
  return Search.deleteMany({ user });
};

module.exports.querySearches = querySearches;
module.exports.getSearchById = getSearchById;
module.exports.createSearch = createSearch;
module.exports.updateSearchById = updateSearchById;
module.exports.deleteSearchById = deleteSearchById;
module.exports.deleteAllUserSearches = deleteAllUserSearches;
