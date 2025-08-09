const mongoose = require('mongoose');
const { postReportCreate } = require('../hooks/reportHook');
const { toJSON, paginate } = require('./plugins');

const reportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'postType',
    },
    postType: {
      type: String,
      required: true,
      enum: ['Free', 'Deal', 'Discussion', 'PromoCode', 'Comment'],
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: () => new Date().getTime(),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

reportSchema.pre('save', async function () {
  await postReportCreate(this);
});

/**
 * @typedef Report
 */
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
