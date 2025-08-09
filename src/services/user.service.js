const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const Deal = require('../models/deal.model');
const PromoCode = require('../models/promocode.model');
const Discussion = require('../models/discussion.model');
const Free = require('../models/free.model');
const { getReferralBonus } = require('../utils/scoreComputing');
const UserSnapshot = require('../models/user-snapshot.model');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Adresse e-mail déjà prise');
  }
  if (await User.isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Nom d'utilisateur déjà pris`);
  }
  if (userBody.referralCode) {
    const user = await User.findById(userBody.referralCode);
    if (user) userBody.score = getReferralBonus(user);
  }
  const newUser = await User.create(userBody);
  const { _id, name, imgUrl, backgroundImg } = newUser;
  const userSnapshot = await UserSnapshot.create({ user: _id, name, imgUrl, backgroundImg });
  return User.findByIdAndUpdate(newUser._id, { snapshotId: userSnapshot._id });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, user) => {
  if (user) {
    // await Visit.create({
    //   user,
    //   vendor: id,
    //   type: visitTypes.VENDOR_VISIT,
    // });
  }
  return User.findById(new mongoose.Types.ObjectId(id));
};

/**
 * Get user by name
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserByName = async (name) => {
  const user = await User.findOne({ name });
  if (!user.shareEmail) user._doc.email = undefined;
  if (!user.sharePhone) user._doc.phonenumber = undefined;
  if (!user.shareAddress) {
    user._doc.street = undefined;
    user._doc.postalCode = undefined;
    user._doc.addresscomplement = undefined;
    user._doc.region = undefined;
    user._doc.city = undefined;
    user._doc.country = undefined;
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Utilisateur non trouvé');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Adresse e-mail déjà prise');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Utilisateur non trouvé');
  }
  await user.remove();
  return user;
};

/**
 * Delete account by user id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteAccount = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Utilisateur non trouvé');
  }
  const updateBody = {
    email: `${user.id}@anonymousaccount.com`,
    name: `Utilisateur anonyme-${user.id}`,
    firstname: '',
    lastname: '',
    phonenumber: '',
    googleId: '',
    imgUrl: '',
    backgroundImg: '',
    street: '',
    postalCode: '',
    addresscomplement: '',
    region: '',
    city: '',
    country: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    isDeleted: true,
    notificationSubscriptions: [],
  };
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Adresse e-mail déjà prise');
  }
  await Deal.updateMany(
    { user: user.id },
    {
      $set: {
        status: '4',
      },
    }
  );
  await PromoCode.updateMany(
    { user: user.id },
    {
      $set: {
        status: '4',
      },
    }
  );
  await Discussion.updateMany(
    { user: user.id },
    {
      $set: {
        status: '4',
      },
    }
  );
  await Free.updateMany(
    { user: user.id },
    {
      $set: {
        status: '4',
      },
    }
  );
  Object.assign(user, updateBody);
  delete user.password;
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByName,
  updateUserById,
  deleteUserById,
  deleteAccount,
};
