const mongoose = require('mongoose');
const { likeTypes } = require('../config/const');
const { toJSON, paginate } = require('./plugins');
const { postAddLikeDislikeHook, postDeleteLikeDislikeHook } = require('../hooks/likeHooks');
const { triggerLikeNotification } = require('../hooks/postActivityCreate');

const likeSchema = mongoose.Schema(
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
      enum: ['Free', 'Deal', 'Discussion', 'PromoCode', 'Comment'],
    },
    status: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: likeTypes.LIKE,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    created_at: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    indexes: [
      {
        post: 1,
        postType: 1,
        type: 1,
        status: 1,
      },
    ],
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
likeSchema.plugin(toJSON);
likeSchema.plugin(paginate);

likeSchema.post('save', async function (like) {
  await postAddLikeDislikeHook(like);
  await triggerLikeNotification(like);
});

likeSchema.post('remove', async function (like) {
  await postDeleteLikeDislikeHook(like);
});

/**
 * @typedef Like
 */
const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
