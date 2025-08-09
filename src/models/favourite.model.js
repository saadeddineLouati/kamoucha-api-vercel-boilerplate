const mongoose = require('mongoose');
const { postDeleteFavoriteHook, postAddFavoriteHook } = require('../hooks/favoriteHooks');

const { Schema } = mongoose;
const { toJSON, paginate } = require('./plugins');

const favouriteSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'postType',
    index: true,
  },
  postType: {
    type: String,
    required: true,
    enum: ['Free', 'Deal', 'Discussion', 'PromoCode', 'Comment'],
  },
  created_at: {
    type: Date,
    default: () => new Date().getTime(),
  },
});

// add plugin that converts mongoose to json
favouriteSchema.plugin(toJSON);
favouriteSchema.plugin(paginate);

favouriteSchema.post('save', async function (favorite) {
  await postAddFavoriteHook(favorite);
});

favouriteSchema.post('remove', async function (favorite) {
  await postDeleteFavoriteHook(favorite);
});

module.exports = mongoose.model('Favorite', favouriteSchema);
