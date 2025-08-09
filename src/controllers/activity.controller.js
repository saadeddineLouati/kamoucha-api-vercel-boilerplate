const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { activityService } = require('../services');
const clean = require('../utils/clean');

const getActivities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['postType', 'user', 'status', 'brand']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await activityService.queryActivities(
    {
      $or: [{ postType: 'Free' }, { postType: 'Deal' }, { postType: 'Discussion' }, { postType: 'PromoCode' }],
      ...clean(filter),
    },
    options
  );
  res.send(result);
});

module.exports = {
  getActivities,
};
