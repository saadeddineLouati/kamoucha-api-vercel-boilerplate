const httpStatus = require('http-status');
const VendorOrder = require('../models/vendororder.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for vendorOrders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryVendorOrders = async (filter, options) => {
  const vendorOrders = await VendorOrder.paginate(filter, options);
  return vendorOrders;
};

/**
 * Get vendorOrder by id
 * @param {ObjectId} id
 * @returns {Promise<VendorOrder>}
 */
const getVendorOrderById = async (id) => {
  return VendorOrder.findById(id);
};

/**
 * Create a vendorOrder
 * @param {Object} vendorOrderBody
 * @returns {Promise<VendorOrder>}
 */
const createVendorOrder = async (vendorOrderBody) => {
  return VendorOrder.create(vendorOrderBody);
};

/**
 * Update vendorOrder by id
 * @param {ObjectId} vendorOrderId
 * @param {Object} updateBody
 * @returns {Promise<VendorOrder>}
 */
const updateVendorOrderById = async (vendorOrderId, updateBody) => {
  const vendorOrder = await getVendorOrderById(vendorOrderId);
  if (!vendorOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Prodcutorder not found');
  }
  Object.assign(vendorOrder, updateBody);
  await vendorOrder.save();
  return vendorOrder;
};

/**
 * Delete vendorOrder by id
 * @param {ObjectId} vendorOrderId
 * @returns {Promise<VendorOrder>}
 */
const deleteVendorOrderById = async (vendorOrderId) => {
  const vendorOrder = await getVendorOrderById(vendorOrderId);
  if (!vendorOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'VendorOrder not found');
  }
  await vendorOrder.remove();
  return vendorOrder;
};

module.exports.queryVendorOrders = queryVendorOrders;
module.exports.getVendorOrderById = getVendorOrderById;
module.exports.createVendorOrder = createVendorOrder;
module.exports.updateVendorOrderById = updateVendorOrderById;
module.exports.deleteVendorOrderById = deleteVendorOrderById;
