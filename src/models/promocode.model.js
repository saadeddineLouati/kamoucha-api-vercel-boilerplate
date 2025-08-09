const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { postPostCreate } = require('../hooks/postHook');
const { toJSON, paginate } = require('./plugins');
const { triggerAlertNotification } = require('../hooks/postActivityCreate');
const { getPostScore } = require('../utils/scoreComputing');

const promoCodeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    url: {
      type: String,
      index: true,
    },
    serialNumber: {
      type: String,
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
    type: {
      type: String,
      required: true,
      index: true,
    },
    link: {
      type: String,
      index: true,
    },
    promoCode: {
      type: String,
      required: true,
      index: true,
    },
    value: {
      type: Number,
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
    startDate: {
      type: Date,
      index: true,
    },
    endDate: {
      type: Date,
      index: true,
    },
    noExpiration: {
      type: Boolean,
      default: true,
    },
    region: {
      type: String,
      index: true,
    },
    city: {
      type: String,
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
        text: true,
      },
    ],
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
      default: 0,
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
      default: 'PromoCode',
    },
    isTrusted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

promoCodeSchema.index({ title: 'text', category: 'text', subCategory: 'text', description: 'text', tags: 'text' });

// add plugin that converts mongoose to json
promoCodeSchema.plugin(toJSON);
promoCodeSchema.plugin(paginate);

/**
 * Increments total likes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
promoCodeSchema.statics.incrementTotalLikes = async function (_id) {
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
promoCodeSchema.statics.decrementTotalLikes = async function (_id) {
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
promoCodeSchema.statics.incrementTotalDislikes = async function (_id) {
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
promoCodeSchema.statics.decrementTotalDislikes = async function (_id) {
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
promoCodeSchema.statics.incrementTotalComments = async function (_id) {
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
promoCodeSchema.statics.decrementTotalComments = async function (_id) {
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
promoCodeSchema.statics.incrementTotalReports = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalReports += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

promoCodeSchema.post('save', async function (promoCode) {
  const serialNumber = slugify(`${promoCode.title}-${promoCode._id}`);
  promoCode.url = `/codes-promo/${encodeURIComponent(serialNumber)}`;
  promoCode.serialNumber = serialNumber;
  await promoCode.model('PromoCode').updateOne({ _id: promoCode._id }, promoCode);
  await triggerAlertNotification(promoCode);
});

promoCodeSchema.pre('save', async function () {
  await postPostCreate(this, 'PromoCode');
});

/**
 * @typedef PromoCode
 */
const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
