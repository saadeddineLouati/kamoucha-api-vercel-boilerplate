const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userSnapshot } = require('../services');
const clean = require('../utils/clean');

const getUsersSnapshots = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['dateString']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userSnapshot.querySnaphots(clean(filter), options);
  res.send(result);
});

module.exports = {
  getUsersSnapshots,
};
