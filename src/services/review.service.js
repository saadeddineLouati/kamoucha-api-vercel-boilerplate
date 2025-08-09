const httpStatus = require('http-status');
const Product = require('../models/product.model');
const Review = require('../models/review.model');
const ProdcutService = require('./product.service');
const ApiError = require('../utils/ApiError');

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, {
    ...options,
    populate: 'user:_id imgUrl name backgroundImg isDeleted isTrusted',
  });
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  return Review.findById(id);
};

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  if (reviewBody.product) {
    const product = await Product.findById(reviewBody.product);
    if (product) {
      const { totalRates = 0, ratingAverage = 0 } = product;
      await ProdcutService.updateProductById(reviewBody.product, {
        totalRates: totalRates + 1,
        ratingAverage: ratingAverage === 0 ? reviewBody.value : (reviewBody.value + ratingAverage) / 2,
      });
    }
  }
  return Review.create(reviewBody);
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody, user) => {
  const review = await Review.findOne({ _id: reviewId, user });
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Produit non trouvé');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId, user) => {
  const review = await Review.findOne({ _id: reviewId, user });
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Avis introuvable');
  }
  await review.remove();
  return review;
};

module.exports.queryReviews = queryReviews;
module.exports.getReviewById = getReviewById;
module.exports.createReview = createReview;
module.exports.updateReviewById = updateReviewById;
module.exports.deleteReviewById = deleteReviewById;
