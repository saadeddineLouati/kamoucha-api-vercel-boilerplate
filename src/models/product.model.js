const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productCode: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    types: [
      {
        type: String,
        required: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    sale_price: {
      type: Number,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
    clothesSize: {
      type: String,
    },
    closthesState: {
      type: String,
    },
    make: {
      type: String,
    },
    mileage: {
      type: Number,
    },
    color: {
      type: String,
    },
    state: {
      type: String,
    },
    gearBox: {
      type: String,
    },
    year: {
      type: Number,
    },
    cylinders: {
      type: String,
    },
    fiscalPower: {
      type: Number,
    },
    bodyType: {
      type: String,
    },
    fuel: {
      type: String,
    },
    gender: {
      type: String,
    },
    size: {
      type: String,
    },
    choessize: {
      type: String,
    },
    height: {
      type: Number,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    seats: {
      type: Number,
    },
    rooms: {
      type: Number,
    },
    wc: {
      type: Number,
    },
    kitchens: {
      type: Number,
    },
    age: {
      type: Number,
    },
    withshipping: {
      type: Boolean,
    },
    copies: {
      type: Number,
      default: 1,
    },
    isflashsale: {
      type: Boolean,
    },
    rank: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    baseprice: {
      type: Number,
    },
    reference: {
      type: String,
    },
    isbn: {
      type: String,
    },
    duration: {
      type: Number,
    },
    availabilityDates: {
      type: Date,
    },
    nonavailabilityDates: {
      type: Date,
    },
    levels: {
      type: Number,
    },
    level: {
      type: Number,
    },
    safeguard: {
      type: Number,
    },
    fees: {
      type: Number,
    },
    furniture: {
      type: Boolean,
    },
    haselevator: {
      type: Boolean,
    },
    activityarea: {
      type: String,
    },
    agreementtype: {
      type: Number,
    },
    function: {
      type: String,
    },
    experience: {
      type: Number,
    },
    studylevel: {
      type: String,
    },
    processor: {
      type: String,
    },
    storage: {
      type: Number,
    },
    ram: {
      type: Number,
    },
    screensize: {
      type: Number,
    },
    hasextensiblememory: {
      type: Boolean,
    },
    isgift: {
      type: Boolean,
    },
    theme: {
      type: String,
    },
    editor: {
      type: String,
    },
    language: {
      type: String,
    },
    author: {
      type: String,
    },
    numberofpages: {
      type: Number,
    },
    isforadults: {
      type: Boolean,
    },
    tags: {
      type: [String],
    },
    totalRates: {
      type: Number,
      default: 0,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    towns: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
    },
    desiredcategories: {
      type: [
        {
          type: String,
        },
      ],
    },
    desiredsubcategories: {
      type: [
        {
          type: String,
        },
      ],
    },
    desiredDescription: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
