/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable prettier/prettier */
/* eslint-disable no-await-in-loop */
const Notification = require('../models/notification.model');
const { likeTypes, notificationTypes } = require('../config/const');
const Search = require('../models/search.model');
const { sendNotificationToUser } = require('../services/push-notification.service');
const { User } = require('../models');

const triggerLikeNotification = async (likeParam) => {
  const like = await likeParam
    .model('Like')
    .findById(likeParam._id)
    .populate('user')
    .populate('post')
    .populate({
      path: 'post',
      populate: {
        path: 'post',
      },
    });
  const isValidUser = await User.findOne({ _id: like.post.user, isDeleted: false, isEmailVerified: true });
  if (!isValidUser) return;
  if (like && String(like.user._id) !== String(like.post.user)) {
    const title =
      like.type === likeTypes.LIKE
        ? `${like.user.name} a aimé votre ${like.postType === 'Comment' ? 'commentaire' : ' post'} !`
        : `${like.user.name} n'aime pas votre ${like.postType === 'Comment' ? 'commentaire' : ' post'} !`;
    const type = like.type === likeTypes.LIKE ? notificationTypes.LIKE_NOTIFICATION : notificationTypes.DISLIKE_NOTIFICATION;
    const notification = new Notification({
      sender: like.user,
      receiver: like.post.user,
      title,
      url: like.postType === 'Comment' ? like.post.post.url : like.post.url,
      type,
      imageUrl: like.user.imageUrl,
    });
    await notification.save();
    await sendNotificationToUser(like.post.user, {
      title,
      data: {
        url: like.post.url,
      },
    });
  }
};

const triggerCommentNotification = async (commentParam) => {
  const comment = await commentParam.model('Comment').findById(commentParam._id).populate('user').populate('post');
  const isValidUser = await User.findOne({ _id: comment.post.user, isDeleted: false, isEmailVerified: true });
  if (!isValidUser) return;
  if (comment && String(comment.user._id) !== String(comment.post.user)) {
    const notification = new Notification({
      sender: comment.user,
      receiver: comment.post.user,
      title: `${comment.user.name} a commenté votre post !`,
      url: comment.post.url,
      type: notificationTypes.COMMENT_NOTIFICATION,
      imageUrl: comment.user.imageUrl,
    });
    await notification.save();
    await sendNotificationToUser(comment.post.user, {
      title: `${comment.user.name} a commenté votre post !`,
      data: {
        url: comment.post.url,
      },
    });
  }
};

async function triggerAlertNotification(postParam) {
  const searches = await Search.find({ withNotifications: true, type: postParam.postType, user: { $ne: postParam.user } });
  // eslint-disable-next-line no-restricted-syntax
  for (const search of searches) {
    const isValidUser = await User.findOne({ _id: search.user, isDeleted: false, isEmailVerified: true });
    if (!isValidUser) continue;

    let post;
    let type;
    let title;
    // eslint-disable-next-line default-case
    if (search.type === 'Discussion') {
      post = await postParam
        .model('Discussion')
        .findOne({ ...search.query, postType: search.type, _id: postParam._id })
        .populate('user');
      if (post) {
        type = notificationTypes.DISCUSSION_NOTIFICATION;
        title = `Découvrez la dernière discussion publié par ${post.user.name}!`;
      }
    }
    if (search.type === 'Deal') {
      post = await postParam
        .model('Deal')
        .findOne({ ...search.query, postType: search.type, _id: postParam._id })
        .populate('user');
      if (post) {
        type = notificationTypes.DEAL_NOTIFICATION;
        title = `Découvrez le dernier bon-plan publié par ${post.user.name}!`;
      }
    }
    if (search.type === 'Free') {
      post = await postParam
        .model('Free')
        .findOne({ ...search.query, postType: search.type, _id: postParam._id })
        .populate('user');
      if (post) {
        type = notificationTypes.FREE_NOTIFICATION;
        title = `Découvrez le dernier gratuit publié par ${post.user.name}!`;
      }
    }
    if (search.type === 'PromoCode') {
      post = await postParam
        .model('PromoCode')
        .findOne({ ...search.query, postType: search.type, _id: postParam._id })
        .populate('user');
      if (post) {
        type = notificationTypes.PROMOCODE_NOTIFICATION;
        title = `Découvrez le dernier code-promo publié par ${post.user.name}!`;
      }
    }

    if (post) {
      const notification = new Notification({
        receiver: search.user,
        title,
        url: post.url,
        type,
      });
      // eslint-disable-next-line no-await-in-loop
      await notification.save();
      await sendNotificationToUser(search.user, {
        title,
        data: {
          url: post.url,
        },
      });
    }
  }
}

const postActivityCreate = async (activity) => {
  switch (activity.postType) {
    case 'Like':
      await triggerLikeNotification(activity.post);
      break;
    case 'Comment':
      await triggerCommentNotification(activity.post);
      break;
    default:
      await triggerAlertNotification(activity.post);
  }
};

async function triggerCatalogueNotification(postParam) {
  const searches = await Search.find({ withNotifications: true, type: 'Catalogue', merchand: postParam.merchand });
  for (const search of searches) {
    const title = `🎉 Nouveau catalogue ${postParam.merchand} disponible maintenant !`;
    const notification = new Notification({
      receiver: search.user,
      title,
      url: `/catalogues/${search.merchand}/${postParam._id}`,
      type: notificationTypes.CATALOGUE_NOTIFICATION,
    });
    // eslint-disable-next-line no-await-in-loop
    await notification.save();
    await sendNotificationToUser(search.user, {
      title,
      data: {
        url: `/catalogues/${search.merchand}/${postParam._id}`,
      },
    });
  }
}

module.exports = {
  postActivityCreate,
  triggerLikeNotification,
  triggerCommentNotification,
  triggerAlertNotification,
  triggerCatalogueNotification,
};
