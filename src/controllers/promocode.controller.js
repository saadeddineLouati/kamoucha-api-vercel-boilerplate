const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { promocodeService } = require('../services');
const { filterKeysToPick } = require('../config/const');
const clean = require('../utils/clean');

const createPromocode = catchAsync(async (req, res) => {
  const promocode = await promocodeService.createPromoCode({
    ...req.body,
    user: req.user._id,
    isTrusted: req.user.isTrusted,
  });
  res.status(httpStatus.CREATED).send(promocode);
});

const getPromocodes = catchAsync(async (req, res) => {
  const filter = pick(req.query, filterKeysToPick);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await promocodeService.queryPromoCodes(clean(filter), options, req.user);
  res.send(result);
});

const getPromocode = catchAsync(async (req, res) => {
  const promocode = await promocodeService.getPromocodeById(req.params.promocodeId);
  if (!promocode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Code promo non trouvé');
  }
  res.send(promocode);
});

const getPromoCodeBySerialNumber = catchAsync(async (req, res) => {
  const promoCode = await promocodeService.getPromoCodeBySerialNumber(
    req.params.serialNumber,
    req.user?._id,
    req.clientIp ? req.clientIp : req.ip
  );
  if (!promoCode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Code promo non trouvé');
  }
  res.send(promoCode);
});

const updatePromocode = catchAsync(async (req, res) => {
  const promocode = await promocodeService.updatePromoCodeById(req.params.promocodeId, req.body, req.user?._id);
  res.send(promocode);
});

const deletePromocode = catchAsync(async (req, res) => {
  await promocodeService.deletePromoCodeById(req.params.promocodeId, req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPromocode,
  getPromocodes,
  getPromocode,
  updatePromocode,
  deletePromocode,
  getPromoCodeBySerialNumber,
};
