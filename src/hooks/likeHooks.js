/* eslint-disable prettier/prettier */
const { likeTypes } = require('../config/const');
const Comment = require('../models/comment.model');
const Deal = require('../models/deal.model');
const Discussion = require('../models/discussion.model');
const Free = require('../models/free.model');
const PromoCode = require('../models/promocode.model');
const User = require('../models/user.model');

const postAddLikeDislikeHook = async (like) => {
  const user = await User.findById(like.user);
  if (like.type === likeTypes.LIKE) {
    user.likes = [...new Set([...user.likes, like.post])];
    await user.save();
    // eslint-disable-next-line default-case
    switch (like.postType) {
      case 'Free':
        await Free.incrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Deal':
        await Deal.incrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Discussion':
        // eslint-disable-next-line no-undef
        await Discussion.incrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'PromoCode':
        // eslint-disable-next-line no-undef
        await PromoCode.incrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Comment':
        await Comment.incrementTotalLikes(like.post);
    }
  }
  if (like.type === likeTypes.DISLIKE) {
    user.dislikes = [...new Set([...user.dislikes, like.post])];
    await user.save();
    // eslint-disable-next-line default-case
    switch (like.postType) {
      case 'Free':
        await Free.incrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Deal':
        await Deal.incrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Discussion':
        // eslint-disable-next-line no-undef
        await Discussion.incrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'PromoCode':
        // eslint-disable-next-line no-undef
        await PromoCode.incrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Comment':
        await Comment.incrementTotalDislikes(like.post);
    }
  }
};

const postDeleteLikeDislikeHook = async (like) => {
  const user = await User.findById(like.user);
  if (like.type === likeTypes.LIKE) {
    user.likes = [...new Set(user.likes?.filter((userLike) => String(userLike) !== String(like.post)))];
    await user.save();
    // eslint-disable-next-line default-case
    switch (like.postType) {
      case 'Free':
        await Free.decrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Deal':
        await Deal.decrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Discussion':
        // eslint-disable-next-line no-undef
        await Discussion.decrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'PromoCode':
        // eslint-disable-next-line no-undef
        await PromoCode.decrementTotalLikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Comment':
        await Comment.decrementTotalLikes(like.post);
    }
  }
  if (like.type === likeTypes.DISLIKE) {
    user.dislikes = [...new Set(user.dislikes?.filter((userDislike) => String(userDislike) !== String(like.post)))];
    await user.save();
    // eslint-disable-next-line default-case
    switch (like.postType) {
      case 'Free':
        await Free.decrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Deal':
        await Deal.decrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Discussion':
        // eslint-disable-next-line no-undef
        await Discussion.decrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'PromoCode':
        // eslint-disable-next-line no-undef
        await PromoCode.decrementTotalDislikes(like.post);
      // eslint-disable-next-line no-fallthrough
      case 'Comment':
        await Comment.decrementTotalDislikes(like.post);
    }
  }
};

module.exports = {
  postAddLikeDislikeHook,
  postDeleteLikeDislikeHook,
};
