const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { contactMessageService } = require('../services');

const createContactMessage = catchAsync(async (req, res) => {
  const contactMessage = await contactMessageService.createContactMessage(req.body);
  res.status(httpStatus.CREATED).send(contactMessage);
});

module.exports = {
  createContactMessage,
};
