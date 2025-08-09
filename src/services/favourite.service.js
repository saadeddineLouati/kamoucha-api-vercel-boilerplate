const httpStatus = require('http-status');
const Favourite = require('../models/favourite.model');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * Query for favourites
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFavourites = async (filter, options) => {
  const favourites = await Favourite.paginate(filter, options);
  return favourites;
};

/**
 * Get favourite by user
 * @param {ObjectId} user
 * @param {Object} filter
 * @returns {Promise<Favourite>}
 */
const getFavouriteByUser = async (user, filter) => {
  return Favourite.find({ ...filter, user })
    .populate('post')
    .populate({
      path: 'post',
      populate: {
        path: 'user',
        model: 'User',
      },
    });
};

/**
 * Create a favourite
 * @param {Object} favouriteBody
 * @returns {Promise<Favourite>}
 */
const createFavourite = async (user, favouriteBody) => {
  const favourite = await Favourite.findOne({ post: favouriteBody.post, user });
  if (favourite) {
    throw new ApiError(httpStatus.CONFLICT, 'Favori déjà créé');
  }
  return Favourite.create({
    user,
    ...favouriteBody,
  });
};

/**
 * Delete favourite by id
 * @param {ObjectId} favouriteId
 * @returns {Promise<Favourite>}
 */
const deleteFavouriteById = async (post, userId) => {
  const user = await userService.getUserById(userId);
  const favorites = user.favorites?.filter((favouriteElement) => String(favouriteElement) !== String(post));
  await userService.updateUserById(userId, { favorites });
  const favourite = await Favourite.findOne({ post, user: userId });
  if (!favourite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Favori introuvable');
  }
  await Favourite.findByIdAndDelete(favourite._id);
  return favourite;
};

/**
 * Delete all user favourites
 * @param {ObjectId} user
 * @returns {Promise<Favourite>}
 */
const deleteAllUserFavourites = async (user) => {
  await userService.updateUserById(user, { favorites: [] });
  await Favourite.deleteMany({ user });
};

module.exports.queryFavourites = queryFavourites;
module.exports.getFavouriteByUser = getFavouriteByUser;
module.exports.createFavourite = createFavourite;
module.exports.deleteFavouriteById = deleteFavouriteById;
module.exports.deleteAllUserFavourites = deleteAllUserFavourites;
