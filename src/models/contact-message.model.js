const validator = require('validator');
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const contactMessageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    company: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email invalide');
        }
      },
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1500,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
contactMessageSchema.plugin(toJSON);
contactMessageSchema.plugin(paginate);

/**
 * @typedef ContactMessage
 */
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;
