/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-catch */
const User = require('../models/user.model');
const UserSnapshot = require('../models/user-snapshot.model');
const { formatDateToString } = require('../utils/vanilla');

const TOTAL_SNAPSHOTS_TO_SAVE = 90;

const createUserSnapshot = async () => {
  try {
    const users = await User.find({ isDeleted: false, isEmailVerified: true }).sort('-score').lean();
    for (const [index, user] of users.entries()) {
      const userSnapshot = await UserSnapshot.findById(user?.snapshotId).lean();
      if (userSnapshot) {
        const { imgUrl, backgroundImg, score } = user;
        let snapshots = userSnapshot.snapshots;
        snapshots.push({ score, imgUrl, backgroundImg, rank: index + 1, dateString: await formatDateToString(new Date()) });
        snapshots = snapshots.slice(Math.max(snapshots.length - TOTAL_SNAPSHOTS_TO_SAVE, 0));
        await UserSnapshot.findByIdAndUpdate(user.snapshotId, { ...userSnapshot, snapshots });
      } else {
        const { _id, name, imgUrl, backgroundImg, score } = user;
        const createdUserSnapshot = await UserSnapshot.create({
          user: _id,
          name,
          imgUrl,
          backgroundImg,
          snapshots: [{ score, imgUrl, backgroundImg, rank: index + 1, dateString: await formatDateToString(new Date()) }],
        });
        await User.findByIdAndUpdate(_id, { snapshotId: createdUserSnapshot._id });
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUserSnapshot,
};
