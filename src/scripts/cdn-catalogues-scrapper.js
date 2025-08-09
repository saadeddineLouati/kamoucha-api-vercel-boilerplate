/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const { uploadImageFromUrl } = require('../services/file.service');
const { createCatalogue } = require('../services/catalogue.service');

const cataloguesArray = [
  {
    merchand: 'Géant',
    category: 'restaurants-et-marchands',
    images: [],
  },
];

async function scrapeCatalogues() {
  for await (const catalogue of cataloguesArray) {
    const images = [];
    for await (const imageUrl of catalogue.images) {
      const image = await uploadImageFromUrl(imageUrl);
      images.push(image);
    }
    try {
      await createCatalogue({ ...catalogue, images, sourceImages: catalogue.images });
    } catch (error) {
      console.log('ssss', error);
    }
  }
}

module.exports = { scrapeCatalogues };
