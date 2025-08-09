const httpStatus = require('http-status');
const Report = require('../models/report.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for reports
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReports = async (filter, options) => {
  const reports = await Report.paginate(filter, options);
  return reports;
};

/**
 * Create a report
 * @param {Object} reportBody
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody) => {
  if (reportBody.user) {
    const report = await Report.findOne({ user: reportBody.user, post: reportBody.post });
    if (report) throw new ApiError(httpStatus.CONFLICT, 'Recherche déjà enregistrée');
  }
  return Report.create(reportBody);
};

module.exports.queryReports = queryReports;
module.exports.createReport = createReport;
