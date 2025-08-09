const httpStatus = require('http-status');
const Alert = require('../models/alert.model');
const ApiError = require('../utils/ApiError');

/**
 * Query for alerts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAlerts = async (filter, options) => {
  const alerts = await Alert.paginate(filter, options);
  return alerts;
};

/**
 * Get alert by id
 * @param {ObjectId} id
 * @returns {Promise<Alert>}
 */
const getAlertById = async (id) => {
  return Alert.findById(id);
};

/**
 * Create a alert
 * @param {Object} alertBody
 * @returns {Promise<Alert>}
 */
const createAlert = async (alertBody) => {
  return Alert.create(alertBody);
};

/**
 * Update alert by id
 * @param {ObjectId} alertId
 * @param {Object} updateBody
 * @returns {Promise<Alert>}
 */
const updateAlertById = async (alertId, updateBody, user) => {
  const alert = await Alert.findOne({ _id: alertId, user });
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alerte introuvable');
  }
  Object.assign(alert, updateBody);
  await alert.save();
  return alert;
};

/**
 * Delete alert by id
 * @param {ObjectId} alertId
 * @returns {Promise<Alert>}
 */
const deleteAlertById = async (alertId, user) => {
  const alert = await Alert.findOne({ _id: alertId, user });
  if (!alert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Alerte introuvable');
  }
  await alert.remove();
  return alert;
};

module.exports.queryAlerts = queryAlerts;
module.exports.getAlertById = getAlertById;
module.exports.createAlert = createAlert;
module.exports.updateAlertById = updateAlertById;
module.exports.deleteAlertById = deleteAlertById;
