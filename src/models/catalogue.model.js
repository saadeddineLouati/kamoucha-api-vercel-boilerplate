const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { triggerCatalogueNotification } = require('../hooks/postActivityCreate');

const catalogueSchema = mongoose.Schema(
  {
    merchand: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    category: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    label: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    sourceImages: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
catalogueSchema.plugin(toJSON);
catalogueSchema.plugin(paginate);

catalogueSchema.post('save', async function (catalogue) {
  await triggerCatalogueNotification(catalogue);
});

/**
 * @typedef Catalogue
 */
const Catalogue = mongoose.model('Catalogue', catalogueSchema);

module.exports = Catalogue;
