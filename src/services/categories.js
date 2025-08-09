const httpStatus = require('http-status');
const categories = require('../data/category.json');
const ApiError = require('../utils/ApiError');

/**
 * Get all categories
 * @returns {Object}
 */
const getAll = async () => {
  return categories.filter((category) => category.category_parent_id === '0');
};

/**
 * Get category by categorySlug
 * @param {string} categorySlug
 * @returns {Object}
 */
const getBySlug = async (categorySlug) => {
  const category = await categories.find((cat) => cat.categorySlug === categorySlug);
  if (category) {
    const subCategories = await categories.filter((cat) => cat.category_parent_id === category.category_id);
    return {
      ...category,
      subCategories,
    };
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'Catégorie introuvable');
};

module.exports.getAll = getAll;
module.exports.getBySlug = getBySlug;
