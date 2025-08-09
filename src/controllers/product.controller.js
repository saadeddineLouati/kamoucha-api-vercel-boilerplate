const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const clean = require('../utils/clean');

const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct({ ...req.body, user: req.user._id });
  res.status(httpStatus.CREATED).send(product);
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'category',
    'subCategory',
    'price',
    'available',
    'user',
    'make',
    'max-sale_price',
    'min-sale_price',
    'ratingAverage',
    'types',
    'available',
    'clothesSize',
    'closthesState',
    'mileage',
    'color',
    'state',
    'gearBox',
    'min-year',
    'max-year',
    'min-mileage',
    'max-mileage',
    'min-surface',
    'max-surface',
    'min-wc',
    'max-wc',
    'min-kitchens',
    'max-kitchens',
    'min-rooms',
    'max-rooms',
    'cylinders',
    'fiscalPower',
    'bodyType',
    'fuel',
    'gender',
    'size',
    'choessize',
    'height',
    'length',
    'width',
    'seats',
    'rooms',
    'wc',
    'kitchens',
    'age',
    'withshipping',
    'copies',
    'isflashsale',
    'rank',
    'discount',
    'baseprice',
    'reference',
    'isbn',
    'duration',
    'availabilityDates',
    'nonavailabilityDates',
    'levels',
    'level',
    'safeguard',
    'fees',
    'furniture',
    'haselevator',
    'activityarea',
    'agreementtype',
    'function',
    'experience',
    'studylevel',
    'processor',
    'storage',
    'ram',
    'screensize',
    'hasextensiblememory',
    'theme',
    'editor',
    'language',
    'author',
    'numberofpages',
    'isforadults',
    'tags',
    'towns',
    'desiredcategories',
    'desiredsubcategories',
    'max-fiscalPower',
    'min-fiscalPower',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // console.log(clean(filter))
  const result = await productService.queryProducts(clean(filter), options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId, req.user?._id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Produit non trouvé');
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
