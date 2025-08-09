const Catalogue = require('../models/catalogue.model');
const Visit = require('../models/visit.model');

/**
 * Create a catalogue
 * @param {Object} catalogueBody
 * @returns {Promise<Catalogue>}
 */
const createCatalogue = async (catalogueBody) => {
  return Catalogue.create(catalogueBody);
};

/**
 * Query for catalogues
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCatalogues = async (filter, options) => {
  const catalogues = await Catalogue.paginate(filter, options);
  return catalogues;
};

/**
 * Get catalogue by id
 * @param {ObjectId} id
 * @returns {Promise<Catalogue>}
 */
const getCatalogueById = async (id, user, ip) => {
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const existingVisits = await Visit.find({ ip, post: id, created_at: { $gte: oneHourAgo } });
  if (!existingVisits.length) {
    await Visit.create({
      user,
      post: id,
      postType: 'Catalogue',
      isAnonym: !user,
      ip,
    });
  }
  return Catalogue.findById(id);
};

module.exports.createCatalogue = createCatalogue;
module.exports.queryCatalogues = queryCatalogues;
module.exports.getCatalogueById = getCatalogueById;
