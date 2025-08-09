const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { postPostCreate } = require('../hooks/postHook');
const { toJSON, paginate } = require('./plugins');
const { triggerAlertNotification } = require('../hooks/postActivityCreate');
const { getPostScore } = require('../utils/scoreComputing');

const dealSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  title: {
    type: String,
    required: true,
    index: true,
    text: true,
    maxLength: 100,
    trim: true,
  },
  brand: {
    type: String,
    index: true,
    text: true,
    maxLength: 50,
    trim: true,
  },
  url: {
    type: String,
  },
  link: {
    type: String,
  },
  serialNumber: {
    type: String,
    index: true,
  },
  category: {
    type: String,
    required: true,
    text: true,
  },
  subCategory: {
    type: String,
    required: true,
    text: true,
  },
  startDate: {
    type: Date,
    index: true,
  },
  endDate: {
    type: Date,
    index: true,
  },
  images: [
    {
      type: String,
    },
  ],
  image: {
    type: String,
  },
  noExpiration: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    required: true,
    index: true,
    text: true,
    maxLength: 1500,
    trim: true,
  },
  region: {
    type: String,
    index: true,
  },
  city: {
    type: String,
    index: true,
  },
  stock: {
    type: Number,
  },
  tags: [
    {
      type: String,
      index: true,
      text: true,
    },
  ],
  price: {
    type: Number,
  },
  sale_price: {
    type: Number,
    index: true,
  },
  withShipping: {
    type: Boolean,
  },
  atStore: {
    type: Boolean,
  },
  deliveryFees: {
    type: Number,
  },
  freeDelivery: {
    type: Boolean,
  },
  make: {
    type: String,
    index: true,
    text: true,
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
    type: String,
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
  choesSize: {
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
  reference: {
    type: String,
  },
  isbn: {
    type: Boolean,
  },
  duration: {
    type: String,
  },
  levels: {
    type: Number,
  },
  level: {
    type: Number,
  },
  safeGuard: {
    type: Number,
  },
  fees: {
    type: Number,
  },
  furniture: {
    type: Boolean,
  },
  hasElevator: {
    type: Boolean,
  },
  activityArea: {
    type: String,
  },
  agreementType: {
    type: String,
  },
  function: {
    type: String,
  },
  experience: {
    type: Number,
  },
  studyLevel: {
    type: String,
  },
  processor: {
    type: String,
  },
  storage: {
    type: String,
  },
  ram: {
    type: Number,
  },
  screenSize: {
    type: Number,
  },
  hasextEnsibleMemory: {
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
  clothesSize: {
    type: String,
  },
  closthesState: {
    type: String,
  },
  numberofpages: {
    type: Number,
  },
  isforadults: {
    type: Boolean,
  },
  totalComments: {
    type: Number,
    default: 0,
    index: true,
  },
  totalLikes: {
    type: Number,
    default: 0,
    index: true,
  },
  totalDislikes: {
    type: Number,
    default: 0,
    index: true,
  },
  totalReports: {
    type: Number,
    default: 0,
    index: true,
  },
  totalViews: {
    type: Number,
    default: 0,
    index: true,
  },
  score: {
    type: Number,
    default: () => new Date().getTime(),
    index: true,
  },
  status: {
    type: String,
    default: 0,
    index: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
    index: true,
  },
  postType: {
    type: String,
    default: 'Deal',
  },
  isTrusted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

dealSchema.index({ title: 'text', category: 'text', subCategory: 'text', description: 'text', tags: 'text' });

// add plugin that converts mongoose to json
dealSchema.plugin(toJSON);
dealSchema.plugin(paginate);

/**
 * Increments total likes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.incrementTotalLikes = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalLikes += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Decrements total likes
 * @param {ObjectId} _id - The id of the post to be decremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.decrementTotalLikes = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalLikes -= 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Increments total dislikes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.incrementTotalDislikes = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalDislikes += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Decrements total dislikes
 * @param {ObjectId} _id - The id of the post to be decremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.decrementTotalDislikes = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalDislikes -= 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Increments total comments
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.incrementTotalComments = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalComments += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Decrements total comments
 * @param {ObjectId} _id - The id of the post to be decremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.decrementTotalComments = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalComments -= 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

/**
 * Increments total reports
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
dealSchema.statics.incrementTotalReports = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalReports += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

dealSchema.post('save', async function (deal) {
  const serialNumber = slugify(`${deal.title}-${deal._id}`);
  deal.url = `/bons-plans/${encodeURIComponent(serialNumber)}`;
  deal.serialNumber = serialNumber;
  await deal.model('Deal').updateOne({ _id: deal._id }, deal);
  await triggerAlertNotification(deal);
});

dealSchema.pre('save', async function () {
  await postPostCreate(this, 'Deal');
});

/**
 * @typedef Deal
 */
const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;
