/* eslint-disable no-useless-catch */
const Deal = require('../models/deal.model');
const { getPostScore } = require('./scoreComputing');

const updateScores = async () => {
  const deals = await Deal.find({}).lean();
  // eslint-disable-next-line no-restricted-syntax
  for await (const deal of deals) {
    try {
      const newScore = getPostScore(deal);
      await Deal.findByIdAndUpdate(deal._id, { ...deal, score: newScore });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = { updateScores };
