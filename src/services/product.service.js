const he = require('he');
const httpStatus = require('http-status');
const Product = require('../models/product.model');
const Visit = require('../models/visit.model');
const ApiError = require('../utils/ApiError');
const { visitTypes } = require('../config/const');

/**
 * Query for products
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id, user) => {
  await Visit.create({
    user,
    productId: id,
    type: visitTypes.PRODUCT_VISIT,
  });
  return Product.findById(id).populate('user', { name: 1, imgUrl: 1, backgroundImg: 1, isTrusted: 1, isDeleted: 1 });
};

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  const product = productBody;
  if (productBody.description) product.description = he.decode(productBody.description);
  return Product.create(product);
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Produit non trouvé');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Produit non trouvé');
  }
  await product.remove();
  return product;
};

module.exports.queryProducts = queryProducts;
module.exports.getProductById = getProductById;
module.exports.createProduct = createProduct;
module.exports.updateProductById = updateProductById;
module.exports.deleteProductById = deleteProductById;
