const Tournament = require('../models/tournament.model');
const { dateWithoutTime } = require('../utils/dates');

/**
 * Query for tournaments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTournaments = async (filter, options) => {
  const tournaments = await Tournament.paginate(filter, {
    ...options,
    populate: 'winner:_id imgUrl name backgroundImg isDeleted isTrusted',
  });
  return tournaments;
};

/**
 * Get tournament by id
 * @param {ObjectId} id
 * @returns {Promise<Tournament>}
 */
const getTournamentById = async (id) => {
  return Tournament.findById(id);
};

/**
 * Create a tournament
 * @param {Object} tournamentBody
 * @returns {Promise<Tournament>}
 */
const createTournament = async (tournamentBody) => {
  return Tournament.create(tournamentBody);
};

/**
 * Get upcoming tournaments dates
 * @param {ObjectId} id
 * @returns {Promise<Tournament>}
 */
const getUpcomingTournamentsDates = async () => {
  const tournaments = await Tournament.find({ date: { $gte: dateWithoutTime() } });
  return tournaments;
};

module.exports.queryTournaments = queryTournaments;
module.exports.getTournamentById = getTournamentById;
module.exports.createTournament = createTournament;
module.exports.getUpcomingTournamentsDates = getUpcomingTournamentsDates;
