const catchAsync = require('../utils/catchAsync');
const { categorieService } = require('../services');

const getCategories = catchAsync(async (req, res) => {
  const result = await categorieService.getAll();
  res.send(result);
});

const getCategoriesBySlug = catchAsync(async (req, res) => {
  const result = await categorieService.getBySlug(req.params.category_slug);
  res.send(result);
});

module.exports = {
  getCategories,
  getCategoriesBySlug,
};
