const httpStatus = require('http-status');
const fileService = require('../services/file.service');
const catchAsync = require('../utils/catchAsync');

const apiUploadFiles = catchAsync(async (req, res) => {
  const file = await fileService.uploadFiles(req.files);
  res.status(httpStatus.CREATED).send(file);
});
module.exports.api_uploadFiles = apiUploadFiles;
