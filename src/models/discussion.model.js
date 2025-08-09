const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { postPostCreate } = require('../hooks/postHook');
const { toJSON, paginate } = require('./plugins');
const { triggerAlertNotification } = require('../hooks/postActivityCreate');
const { getPostScore } = require('../utils/scoreComputing');

const discussionSchema = mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    index: true,
    text: true,
    maxLength: 1500,
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
  createdAt: {
    type: Date,
    default: () => new Date().getTime(),
    index: true,
  },
  postType: {
    type: String,
    default: 'Discussion',
  },
  status: {
    type: String,
    default: 0,
    index: true,
  },
  isTrusted: {
    type: Boolean,
    default: false,
    index: true,
  },
  tags: [
    {
      type: String,
      default: [],
      index: true,
      text: true,
    },
  ],
});

discussionSchema.index({ title: 'text', category: 'text', subCategory: 'text', description: 'text', tags: 'text' });

// add plugin that converts mongoose to json
discussionSchema.plugin(toJSON);
discussionSchema.plugin(paginate);

/**
 * Increments total likes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
discussionSchema.statics.incrementTotalLikes = async function (_id) {
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
discussionSchema.statics.decrementTotalLikes = async function (_id) {
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
discussionSchema.statics.incrementTotalDislikes = async function (_id) {
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
discussionSchema.statics.decrementTotalDislikes = async function (_id) {
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
discussionSchema.statics.incrementTotalComments = async function (_id) {
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
discussionSchema.statics.decrementTotalComments = async function (_id) {
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
discussionSchema.statics.incrementTotalReports = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalReports += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

discussionSchema.post('save', async function (discussion) {
  const serialNumber = slugify(`${discussion.title}-${discussion._id}`);
  discussion.url = `/discussions/${encodeURIComponent(serialNumber)}`;
  discussion.serialNumber = serialNumber;
  await discussion.model('Discussion').updateOne({ _id: discussion._id }, discussion);
  await triggerAlertNotification(discussion);
});

discussionSchema.pre('save', async function () {
  await postPostCreate(this, 'Discussion');
});

/**
 * @typedef Discussion
 */
const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
