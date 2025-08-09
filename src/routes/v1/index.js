const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const healthRoute = require('./health.route');
const productRoute = require('./product.route');
const favouriteRoute = require('./favourite.route');
const categoryRoute = require('./category.route');
const addressRoute = require('./address.route');
const reviewRoute = require('./review.route');
const alertRoute = require('./alert.route');
const searchRoute = require('./search.route');
const boostRoute = require('./boost.route');
const newsletterRoute = require('./newsletter.route');
const chatRoute = require('./chat.route');
const contentRoute = require('./content.route');
const followRoute = require('./follow.route');
const promocodeRoute = require('./promocode.route');
const fileRoute = require('./file.route');
const dealRoute = require('./deal.route');
const freeRoute = require('./free.route');
const discussionRoute = require('./discussion.route');
const commentRoute = require('./comment.route');
const likeRoute = require('./like.route');
const activityRoute = require('./activity.route');
const reportRoute = require('./report.route');
const notificationRoute = require('./notification.route');
const contactMessageRoute = require('./contact-message.route');
const tournamentRoute = require('./tournament.route');
const cataloguetRoute = require('./catalogue.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/health',
    route: healthRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/deals',
    route: dealRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/favourites',
    route: favouriteRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/addresses',
    route: addressRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/alerts',
    route: alertRoute,
  },
  {
    path: '/searches',
    route: searchRoute,
  },
  {
    path: '/boosts',
    route: boostRoute,
  },
  {
    path: '/newsletter',
    route: newsletterRoute,
  },
  {
    path: '/chats',
    route: chatRoute,
  },
  {
    path: '/content',
    route: contentRoute,
  },
  {
    path: '/follows',
    route: followRoute,
  },
  {
    path: '/promo-codes',
    route: promocodeRoute,
  },
  {
    path: '/frees',
    route: freeRoute,
  },
  {
    path: '/discussions',
    route: discussionRoute,
  },
  {
    path: '/comments',
    route: commentRoute,
  },
  {
    path: '/likes',
    route: likeRoute,
  },
  {
    path: '/activities',
    route: activityRoute,
  },
  {
    path: '/reports',
    route: reportRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/contact-message',
    route: contactMessageRoute,
  },
  {
    path: '/tournaments',
    route: tournamentRoute,
  },
  {
    path: '/catalogues',
    route: cataloguetRoute,
  },
  {
    path: '/files',
    route: fileRoute,
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
