const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { addressService } = require('../services');

const createAddress = catchAsync(async (req, res) => {
  const Address = await addressService.createAddress({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(Address);
});

const getAddresses = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['title', 'description', 'price', 'available']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await addressService.queryAddresses(req.user._id);
  res.send(result);
});

const getAddress = catchAsync(async (req, res) => {
  const Address = await addressService.getAddressById(req.params.addressId);
  if (!Address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Adresse introuvable');
  }
  res.send(Address);
});

const updateAddress = catchAsync(async (req, res) => {
  const Address = await addressService.updateAddressById(req.params.addressId, req.body, req.user?._id);
  res.send(Address);
});

const deleteAddress = catchAsync(async (req, res) => {
  await addressService.deleteAddressById(req.params.addressId, req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
};
