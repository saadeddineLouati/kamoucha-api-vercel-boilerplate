const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getLeaderboard = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.sortBy = '-score';
  options.populate = 'snapshotId';
  options.select = { name: 1, imgUrl: 1, isTrusted: 1, score: 1, createdAt: 1 };
  const result = await userService.queryUsers({ isDeleted: false, isEmailVerified: true }, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId, req.user?._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Utilisateur non trouvé');
  }
  res.send(user);
});

const getUserByName = catchAsync(async (req, res) => {
  const user = await userService.getUserByName(req.params.name, req.user?._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Utilisateur non trouvé');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.user._id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteAccount = catchAsync(async (req, res) => {
  await userService.deleteAccount(req.user?._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserByName,
  updateUser,
  deleteUser,
  deleteAccount,
  getLeaderboard,
};
