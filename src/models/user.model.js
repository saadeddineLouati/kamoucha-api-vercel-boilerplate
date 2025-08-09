const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { getUserScore } = require('../utils/scoreComputing');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email invalide');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Le mot de passe doit contenir au moins une lettre et un chiffre');
        }
      },
      private: true, // used by the toJSON plugin
    },
    googleId: {
      type: String,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
      private: true, // used by the toJSON plugin
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
      private: true, // used by the toJSON plugin
    },
    shareEmail: {
      type: Boolean,
      default: false,
    },
    sharePhone: {
      type: Boolean,
      default: false,
    },
    shareAddress: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    coins: {
      type: Number,
      default: 10,
      private: true, // used by the toJSON plugin
    },
    coinName: {
      type: String,
      default: process.env.COIN_NAME,
      private: true, // used by the toJSON plugin
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        private: true, // used by the toJSON plugin
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        private: true, // used by the toJSON plugin
      },
    ],
    configs: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        pushnotifications: false,
        emailnotification: false,
      },
      private: true, // used by the toJSON plugin
    },
    badges: [String],
    imgUrl: {
      type: String,
    },
    backgroundImg: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      private: true, // used by the toJSON plugin
    },
    phonenumber: {
      type: String,
    },
    street: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    addresscomplement: {
      type: String,
    },
    region: {
      type: String,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      default: 'Tunisie',
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    youtube: {
      type: String,
    },
    boostsleft: {
      type: Number,
      default: 0,
      private: true, // used by the toJSON plugin
    },
    postsleft: {
      type: Number,
      default: 10,
      private: true, // used by the toJSON plugin
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    deals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    frees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    promocodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    discussions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    commentLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    notificationSubscriptions: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: [],
        private: true, // used by the toJSON plugin
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    isTrusted: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    snapshotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSnapshot',
    },
  },
  {
    indexes: [
      {
        name: 1,
        email: 1,
      },
    ],
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if name is taken
 * @param {string} name - The user's name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isNameTaken = async function (name, excludeUserId) {
  const user = await this.findOne({ name, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Push new favorite
 * @param {ObjectId} userId
 * @param {ObjectId} favorite
 * @returns {Promise<boolean>}
 */
userSchema.statics.pushNewFavorite = async function (userId, favorite) {
  const user = await this.findById(userId);
  if (user) {
    user.favorites = [...new Set([...user.favorites, favorite])];
    user.save();
  }
};

/**
 * Drop favorite
 * @param {ObjectId} userId
 * @param {ObjectId} favorite
 * @returns {Promise<boolean>}
 */
userSchema.statics.dropFavorite = async function (userId, favorite) {
  const user = await this.findById(userId);
  if (user) {
    user.favorites = [...new Set(user.favorites.filter((userFav) => String(userFav) !== String(favorite)))];
    user.save();
  }
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  const fieldsToTriggerScoreComputing = [
    'likes',
    'dislikes',
    'comments',
    'deals',
    'frees',
    'promocodes',
    'discussions',
    'commentLikes',
  ];

  fieldsToTriggerScoreComputing.forEach(async (field) => {
    if (user.isModified(field)) {
      user.score = getUserScore(user);
    }
  });
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
