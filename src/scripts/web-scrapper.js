/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-syntax */
const { brands } = require('./jumia.data');
const { dealService } = require('../services');

// Function to scrape the website and extract product data
async function scrapeWebsite() {
  for (const product of brands) {
    // eslint-disable-next-line no-await-in-loop
    await dealService.createDeal(product);
  }
}

module.exports = { scrapeWebsite };
