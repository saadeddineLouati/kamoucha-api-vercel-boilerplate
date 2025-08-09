/* eslint-disable prettier/prettier */
const Deal = require('../models/deal.model');
const Discussion = require('../models/discussion.model');
const Free = require('../models/free.model');
const PromoCode = require('../models/promocode.model');
const User = require('../models/user.model');

const postAddCommentHook = async (comment) => {
  const user = await User.findById(comment.user);
  user.comments = [...new Set([...user.comments, String(comment._id)])];
  await user.save();
  // eslint-disable-next-line default-case
  switch (comment.postType) {
    case 'Free':
      await Free.incrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'Deal':
      await Deal.incrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'Discussion':
      // eslint-disable-next-line no-undef
      await Discussion.incrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'PromoCode':
      // eslint-disable-next-line no-undef
      await PromoCode.incrementTotalComments(comment.post);
  }
};

const postDeleteLikeDiscommentHook = async (comment) => {
  const user = await User.findById(comment.user);
  user.comments = [...new Set(user.comments?.filter((userLike) => String(userLike) !== String(comment._id)))];
  await user.save();
  // eslint-disable-next-line default-case
  switch (comment.postType) {
    case 'Free':
      await Free.decrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'Deal':
      await Deal.decrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'Discussion':
      // eslint-disable-next-line no-undef
      await Discussion.decrementTotalComments(comment.post);
    // eslint-disable-next-line no-fallthrough
    case 'PromoCode':
      // eslint-disable-next-line no-undef
      await PromoCode.decrementTotalComments(comment.post);
  }
};

module.exports = {
  postAddCommentHook,
  postDeleteLikeDiscommentHook,
};
