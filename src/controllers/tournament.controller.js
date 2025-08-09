const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tournamentService } = require('../services');
const clean = require('../utils/clean');

const createTournament = catchAsync(async (req, res) => {
  const tournament = await tournamentService.createTournament(req.body);
  res.status(httpStatus.CREATED).send(tournament);
});

const getTournaments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'startDate', 'startDate', 'dateString', 'status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tournamentService.queryTournaments(clean(filter), options);
  res.send(result);
});

const getTournament = catchAsync(async (req, res) => {
  const tournament = await tournamentService.getTournamentById(req.params.tournamentId);
  if (!tournament) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tournament introuvable');
  }
  res.send(tournament);
});

const getUpcomingTournamentsDates = catchAsync(async (req, res) => {
  const tournaments = await tournamentService.getUpcomingTournamentsDates();
  res.send(tournaments);
});

module.exports = {
  createTournament,
  getTournaments,
  getTournament,
  getUpcomingTournamentsDates,
};
