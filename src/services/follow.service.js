const httpStatus = require('http-status');
const Follow = require('../models/follow.model');
const User = require('../models/user.model');
const UserService = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * Query for follows
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFollows = async (filter, options) => {
  const follows = await Follow.paginate(filter, options);
  return follows;
};

/**
 * Create a follow
 * @param {Object} followBody
 * @returns {Promise<Follow>}
 */
const createFollow = async (followBody) => {
  if (String(followBody.follower) === String(followBody.followed)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Requête invalide');
  }
  const follower = await User.findById(followBody.follower);
  const followed = await User.findById(followBody.followed);
  if (follower) {
    let following = [];
    if (follower.following) {
      following = follower.following;
      following.push(followBody.followed);
    }
    await UserService.updateUserById(followBody.follower, { following: [...new Set(following.map((e) => String(e)))] });
  }
  if (followed) {
    let followers = [];
    if (follower.followers) {
      followers = follower.followers;
      followers.push(followBody.follower);
    }
    await UserService.updateUserById(followBody.followed, { followers: [...new Set(followers.map((e) => String(e)))] });
  }
  return Follow.create(followBody);
};

/**
 * Unfollow user by id
 * @param {ObjectId} userId
 * @returns {Promise<Favourite>}
 */
const unfollow = async (userId, loggedInUser) => {
  const follow = await Follow.findOne({ follower: loggedInUser, followed: userId });
  const follower = await User.findById(loggedInUser);
  const followed = await User.findById(userId);
  if (follower) {
    let following = [];
    if (follower.following) {
      following = follower.following.filter((e) => String(e) !== String(userId));
    }
    await UserService.updateUserById(loggedInUser, { following });
  }
  if (followed) {
    let followers = [];
    if (followed.followers) {
      followers = followed.followers.filter((e) => String(e) !== String(loggedInUser));
    }
    await UserService.updateUserById(userId, { followers });
  }
  if (!follow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Follow introuvable');
  }
  await follow.remove();
  return follow;
};

/**
 * Get logged in user followers list
 * @param {*} user
 */
const getFollwers = (user) => {
  return Follow.find({ followed: user });
};
/**
 * Get logged in user followed list
 * @param {*} user
 */
const getFollowed = (user) => {
  return Follow.find({ follower: user });
};

module.exports.queryFollows = queryFollows;
module.exports.createFollow = createFollow;
module.exports.getFollwers = getFollwers;
module.exports.getFollowed = getFollowed;
module.exports.unfollow = unfollow;
