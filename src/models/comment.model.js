const mongoose = require('mongoose');
const { postAddCommentHook } = require('../hooks/commentHooks');
const { toJSON, paginate } = require('./plugins');
const { triggerCommentNotification } = require('../hooks/postActivityCreate');
const { getPostScore } = require('../utils/scoreComputing');

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'postType',
    },
    postType: {
      type: String,
      required: true,
      enum: ['Free', 'Deal', 'Discussion', 'PromoCode'],
    },
    value: {
      type: Number,
    },
    comment: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    created_at: {
      type: Date,
      default: () => new Date().getTime(),
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalDislikes: {
      type: Number,
      default: 0,
    },
    totalReports: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    isTrusted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    indexes: [{ post: 1, postType: 1, comment: 1, totalLikes: 1, totalDislikes: 1, totalReports: 1, score: 1 }],
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(paginate);

/**
 * Increments total likes
 * @param {ObjectId} _id - The id of the post to be incremented
 * @returns {Promise<boolean>}
 */
commentSchema.statics.incrementTotalLikes = async function (_id) {
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
commentSchema.statics.decrementTotalLikes = async function (_id) {
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
commentSchema.statics.incrementTotalDislikes = async function (_id) {
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
commentSchema.statics.decrementTotalDislikes = async function (_id) {
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
commentSchema.statics.incrementTotalComments = async function (_id) {
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
commentSchema.statics.decrementTotalComments = async function (_id) {
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
commentSchema.statics.incrementTotalReports = async function (_id) {
  const post = await this.findOne({ _id });
  if (post) {
    post.totalReports += 1;
    post.score = getPostScore(post);
    await post.updateOne(post);
  }
};

commentSchema.post('save', async function (comment) {
  await triggerCommentNotification(comment);
});

commentSchema.pre('save', async function () {
  await postAddCommentHook(this);
});

/**
 * @typedef Comment
 */
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
