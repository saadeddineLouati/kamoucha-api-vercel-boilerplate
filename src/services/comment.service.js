const httpStatus = require('http-status');
const Comment = require('../models/comment.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for comments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (filter, options) => {
  const comments = await Comment.paginate(filter, {
    sortBy: '-createdAt:',
    ...options,
    populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted',
  });
  return comments;
};

/**
 * Get comment by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Create a comment
 * @param {Object} commentBody
 * @returns {Promise<Comment>}
 */
const createComment = async (commentBody) => {
  return Comment.create(commentBody);
};

/**
 * Update comment by id
 * @param {ObjectId} commentId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (commentId, updateBody, user) => {
  const comment = await Comment.findOne({ _id: commentId, user });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Produit non trouvé');
  }
  Object.assign(comment, updateBody);
  await comment.save();
  return comment;
};

/**
 * Delete comment by id
 * @param {ObjectId} commentId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (commentId, user) => {
  const comment = await Comment.findOne({ _id: commentId, user });
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Commentaire introuvable');
  }
  await comment.remove();
  return comment;
};

module.exports.queryComments = queryComments;
module.exports.getCommentById = getCommentById;
module.exports.createComment = createComment;
module.exports.updateCommentById = updateCommentById;
module.exports.deleteCommentById = deleteCommentById;
