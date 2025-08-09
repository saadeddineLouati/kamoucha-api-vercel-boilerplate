const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { postPostCreate } = require('../hooks/postHook');
const { toJSON, paginate } = require('./plugins');
const { triggerAlertNotification } = require('../hooks/postActivityCreate');
const { getPostScore } = require('../utils/scoreComputing');

const freeSchema = mongoose.Schema({
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
  serialNumber: {
    type: String,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
    text: true,
  },
  subCategory: {
    type: String,
    required: true,
    index: true,
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
    text: true,
  },
  city: {
    type: String,
    index: true,
    text: true,
  },
  stock: {
    type: Number,
  },
  tags: [
    {
      type: String,
      default: [],
      index: true,
      text: true,
    },
  ],
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
    default: 0,
    index: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
    index: true,
  },
  status: {
    type: String,
    default: 0,
    index: true,
  },
  postType: {
    type: String,
    default: 'Free',
  },
  isTrusted: {
    type: Boolean,
    default: false,
    index: true,
  },
});

freeSchema.index({ title: 'text', category: 'text', subCategory: 'text', description: 'text', tags: 'text' });

// add plugin that converts mongoose to json
freeSchema.plugin(toJSON);
freeSchema.plugin(paginate);

/**
 * Increments total likes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
freeSchema.statics.incrementTotalLikes = async function (_id) {
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
freeSchema.statics.decrementTotalLikes = async function (_id) {
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
freeSchema.statics.incrementTotalDislikes = async function (_id) {
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
freeSchema.statics.decrementTotalDislikes = async function (_id) {
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
freeSchema.statics.incrementTotalComments = async function (_id) {
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
freeSchema.statics.decrementTotalComments = async function (_id) {
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
freeSchema.statics.incrementTotalReports = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalReports += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

freeSchema.post('save', async function (free) {
  const serialNumber = slugify(`${free.title}-${free._id}`);
  free.url = `/gratuit/${encodeURIComponent(serialNumber)}`;
  free.serialNumber = serialNumber;
  await free.model('Free').updateOne({ _id: free._id }, free);
  await triggerAlertNotification(free);
});

freeSchema.pre('save', async function () {
  await postPostCreate(this, 'Free');
});

/**
 * @typedef Free
 */
const Free = mongoose.model('Free', freeSchema);

module.exports = Free;
