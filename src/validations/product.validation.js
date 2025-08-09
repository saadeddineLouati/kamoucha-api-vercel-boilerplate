const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    images: Joi.array().required(),
    price: Joi.number().required(),
    sale_price: Joi.number().required(),
    stock: Joi.number().required(),
    available: Joi.boolean(),
    types: Joi.array().items(Joi.string().required()),
    towns: Joi.array().items(Joi.string().required()),
    tags: Joi.array().items(Joi.string()),
    make: Joi.string(),
    mileage: Joi.number(),
    color: Joi.string(),
    state: Joi.string(),
    gearBox: Joi.string(),
    year: Joi.number(),
    cylinders: Joi.string(),
    fiscalPower: Joi.number(),
    bodyType: Joi.string(),
    fuel: Joi.string(),
    gender: Joi.string(),
    size: Joi.string(),
    choessize: Joi.string(),
    height: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
    seats: Joi.number(),
    rooms: Joi.number(),
    wc: Joi.number(),
    kitchens: Joi.number(),
    age: Joi.number(),
    withshipping: Joi.boolean(),
    copies: Joi.number(),
    isflashsale: Joi.boolean(),
    rank: Joi.number(),
    discount: Joi.number(),
    baseprice: Joi.number(),
    reference: Joi.string(),
    isbn: Joi.boolean(),
    duration: Joi.string(),
    availabilityDates: Joi.date(),
    nonavailabilityDates: Joi.date(),
    levels: Joi.number(),
    level: Joi.number(),
    safeguard: Joi.number(),
    fees: Joi.number(),
    furniture: Joi.boolean(),
    haselevator: Joi.boolean(),
    activityarea: Joi.string(),
    agreementtype: Joi.number(),
    function: Joi.string(),
    experience: Joi.number(),
    studylevel: Joi.string(),
    processor: Joi.string(),
    storage: Joi.number(),
    ram: Joi.number(),
    screensize: Joi.number(),
    hasextensiblememory: Joi.boolean(),
    isgift: Joi.boolean(),
    theme: Joi.string(),
    editor: Joi.string(),
    language: Joi.string(),
    author: Joi.string(),
    clothesSize: Joi.string(),
    closthesState: Joi.string(),
    numberofpages: Joi.number(),
    isforadults: Joi.boolean(),
    totalRates: Joi.number(),
    ratingAverage: Joi.number(),
    region: Joi.string(),
    city: Joi.string(),
    desiredcategories: Joi.array(),
    desiredsubcategories: Joi.array(),
    desiredDescription: Joi.string(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    make: Joi.string(),
    ['types' ||
    'available' ||
    'clothesSize' ||
    'closthesState' ||
    'mileage' ||
    'color' ||
    'state' ||
    'gearBox' ||
    'bodyType' ||
    'fuel' ||
    'gender' ||
    'size' ||
    'choessize' ||
    'height' ||
    'length' ||
    'width' ||
    'seats' ||
    'rooms' ||
    'wc' ||
    'kitchens' ||
    'age' ||
    'withshipping' ||
    'copies' ||
    'isflashsale' ||
    'rank' ||
    'discount' ||
    'baseprice' ||
    'reference' ||
    'isbn' ||
    'duration' ||
    'availabilityDates' ||
    'nonavailabilityDates' ||
    'levels' ||
    'level' ||
    'safeguard' ||
    'fees' ||
    'furniture' ||
    'haselevator' ||
    'activityarea' ||
    'agreementtype' ||
    'function' ||
    'experience' ||
    'studylevel' ||
    'processor' ||
    'storage' ||
    'ram' ||
    'screensize' ||
    'hasextensiblememory' ||
    'theme' ||
    'editor' ||
    'language' ||
    'author' ||
    'numberofpages' ||
    'isforadults' ||
    'tags' ||
    'towns' ||
    'desiredcategories' ||
    'desiredsubcategories']: Joi.string(),
    ['max-sale_price' ||
    'ratingAverage' ||
    'min-sale_price' ||
    'min-year' ||
    'max-year' ||
    'cylinders' ||
    'max-fiscalPower' ||
    'min-fiscalPower' ||
    'min-mileage' ||
    'max-mileage' ||
    'min-surface' ||
    'max-surface' ||
    'min-wc' ||
    'max-wc' ||
    'min-kitchens' ||
    'max-kitchens' ||
    'min-rooms' ||
    'max-rooms']: Joi.number(),
    desiredDescription: Joi.string(),
    available: Joi.boolean(),
    user: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      category: Joi.string(),
      subCategory: Joi.string(),
      price: Joi.number(),
      available: Joi.boolean(),
      types: Joi.array().items(Joi.string().required()),
      towns: Joi.array().items(Joi.string().required()),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
