/* eslint-disable prettier/prettier */
const User = require('../models/user.model');

const postAddFavoriteHook = async (favorite) => {
  const user = await User.findById(favorite.user);
  if (user) {
    await User.pushNewFavorite(favorite.user, favorite.post);
  }
};

const postDeleteFavoriteHook = async (favorite) => {
  const user = await User.findById(favorite.user);
  if (user) {
    await User.dropFavorite(favorite.user, favorite.post);
  }
};

module.exports = {
  postAddFavoriteHook,
  postDeleteFavoriteHook,
};
