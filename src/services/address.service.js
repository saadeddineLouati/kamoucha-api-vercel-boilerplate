const httpStatus = require('http-status');
const Address = require('../models/address.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for addresses
 * @returns {Promise<QueryResult>}
 */
const queryAddresses = async (user) => {
  const addresses = await Address.find({ user });
  return addresses;
};

/**
 * Get address by id
 * @param {ObjectId} id
 * @returns {Promise<Address>}
 */
const getAddressById = async (id) => {
  return Address.findById(id);
};

/**
 * Create a address
 * @param {Object} addressBody
 * @returns {Promise<Address>}
 */
const createAddress = async (addressBody) => {
  return Address.create(addressBody);
};

/**
 * Update address by id
 * @param {ObjectId} addressId
 * @param {Object} updateBody
 * @returns {Promise<Address>}
 */
const updateAddressById = async (addressId, updateBody, user) => {
  const address = await Address.findOne({ _id: addressId, user });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Adresse introuvable');
  }
  Object.assign(address, updateBody);
  await address.save();
  return address;
};

/**
 * Delete address by id
 * @param {ObjectId} addressId
 * @returns {Promise<Address>}
 */
const deleteAddressById = async (addressId, user) => {
  const address = await Address.findOne({ _id: addressId, user });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Adresse introuvable');
  }
  await address.remove();
  return address;
};

module.exports.queryAddresses = queryAddresses;
module.exports.getAddressById = getAddressById;
module.exports.createAddress = createAddress;
module.exports.updateAddressById = updateAddressById;
module.exports.deleteAddressById = deleteAddressById;
