/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const Catalogue = require('../models/catalogue.model');

const newCatalogues = [];

const ingestCatalogues = async () => {
  for await (const catalogue of newCatalogues) {
    try {
      await Catalogue.create(catalogue);
    } catch (error) {
      console.log('error', catalogue.merchand, error);
    }
  }
};

module.exports = { ingestCatalogues };
