/* eslint-disable no-restricted-syntax */
const { default: slugify } = require('slugify');
const Activity = require('../models/activity.model');
const PromoCode = require('../models/promocode.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const visit = require('../models/visit.model');
const { getPostScore } = require('../utils/scoreComputing');

const recover = async () => {
  const promocodesActivities = await Activity.find({ postType: 'PromoCode' }).lean();
  const promocodes = [];
  for await (const activity of promocodesActivities) {
    const serialNumber = slugify(`${activity?.metadata.title}-${activity?.metadata._id}`);
    const totalComments = await Comment.countDocuments({ post: activity?.metadata?._id });
    const totalLikes = await Like.countDocuments({ post: activity.metadata?._id, type: 'LIKE' });
    const totalDislikes = await Like.countDocuments({ post: activity.metadata?._id, type: 'DISLIKE' });
    const totalViews = await visit.countDocuments({ post: activity.metadata?._id });
    promocodes.push({
      ...activity.metadata,
      url: `/codes-promo/${encodeURIComponent(serialNumber)}`,
      serialNumber,
      totalDislikes,
      totalLikes,
      totalComments,
      totalViews,
      score: getPostScore({
        serialNumber,
        totalDislikes,
        totalLikes,
        totalComments,
        totalViews,
      }),
    });
  }
  await PromoCode.insertMany(promocodes);
};

module.exports = { recover };
