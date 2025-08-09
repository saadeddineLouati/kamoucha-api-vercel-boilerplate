const { createUserSnapshot } = require('./UserSnaphot.cron');

const DailyCronsHandler = async () => {
  await createUserSnapshot();
};

module.exports = DailyCronsHandler;
