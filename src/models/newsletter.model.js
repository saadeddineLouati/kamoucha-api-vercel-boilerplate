const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const newsletterSchema = mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
newsletterSchema.plugin(toJSON);
newsletterSchema.plugin(paginate);

/**
 * @typedef Newsletter
 */
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
