const httpStatus = require('http-status');
const Like = require('../models/like.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for likes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLikes = async (filter, options) => {
  const likes = await Like.paginate(filter, {
    ...options,
    populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted',
  });
  return likes;
};

/**
 * Create a like
 * @param {Object} likeBody
 * @returns {Promise<Like>}
 */
const createLike = async (likeBody) => {
  const newLike = new Like(likeBody);
  const { type, ...likeWithoutType } = likeBody;
  const like = await Like.findOne(likeWithoutType);
  if (like) {
    await this.deleteUserPostLikes(like.post, like.user);
  }
  return newLike.save();
};

/**
 * Update like by user and post id
 * @param {ObjectId} likeId
 * @param {Object} updateBody
 * @returns {Promise<Like>}
 */
const updateLikeByUserAndPost = async (post, user, type, postType, status) => {
  const options = { new: true };
  let like = await Like.findOne({ post, user, type, postType, status: 0 });
  if (!like) return;
  like = await Like.findOneAndUpdate({ post, user, type, postType }, { status }, options);
  return like;
};

/**
 * Delete like by id
 * @param {ObjectId} likeId
 * @returns {Promise<Like>}
 */
const deleteLikeById = async (likeId, user) => {
  const like = await Like.findOne({ _id: likeId, user });
  if (!like) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Like non trouvé');
  }
  await like.remove();
  return like;
};

/**
 * Delete like
 * @param {ObjectId} likeId
 * @returns {Promise<Like>}
 */
const deleteLike = async (post, user, type) => {
  const like = await Like.findOne({ post, user, type });
  if (!like) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Like non trouvé');
  }
  await like.remove();
  return like;
};

/**
 * Delete like
 * @param {ObjectId} likeId
 * @returns {Promise<Like>}
 */
const deleteUserPostLikes = async (post, user) => {
  const like = await Like.findOne({ post, user });
  await like.remove();
  return like;
};

/**
 * Like Handler
 * @param {any} likeBody
 * @returns {Promise<Like>}
 */
const likeHandler = async ({ user, post, type, postType }) => {
  const likeTypeNegation = {
    LIKE: 'DISLIKE',
    DISLIKE: 'LIKE',
  };
  try {
    const existingLike = await Like.find({ user, post, postType });
    if (existingLike && existingLike.type === type) return await Like.findByIdAndDelete(existingLike);
    if (existingLike && existingLike.type !== type) {
      await Like.findByIdAndDelete(existingLike);
      const newLike = new Like({ user, post, type: likeTypeNegation[type], postType });
      return await newLike.save();
    }
    const newLike = new Like({ user, post, type, postType });
    return await newLike.save();
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Interdit');
  }
};

module.exports.queryLikes = queryLikes;
module.exports.createLike = createLike;
module.exports.updateLikeByUserAndPost = updateLikeByUserAndPost;
module.exports.deleteLikeById = deleteLikeById;
module.exports.deleteLike = deleteLike;
module.exports.deleteUserPostLikes = deleteUserPostLikes;
module.exports.likeHandler = likeHandler;
