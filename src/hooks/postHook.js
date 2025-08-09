/* eslint-disable prettier/prettier */
const Activity = require('../models/activity.model');
const User = require('../models/user.model');

const postPostCreate = async (post, postType) => {
  const user = await User.findById(post.user);
  const metadata = { ...post };
  if (user) {
    const activity = new Activity({
      user: post.user,
      post,
      postType,
      brand: post.brand,
      status: post.status,
      metadata,
    });

    user[`${postType.toLowerCase()}s`] = [...new Set([...user[`${postType.toLowerCase()}s`], post._id])];
    await user.save();

    await activity.save();
  }
};

module.exports = {
  postPostCreate,
};
