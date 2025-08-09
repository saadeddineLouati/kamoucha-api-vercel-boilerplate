const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tournamentValidation = require('../../validations/tournament.validation');
const tournamentController = require('../../controllers/tournament.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(tournamentValidation.createTournament), tournamentController.createTournament)
  .get(validate(tournamentValidation.getTournaments), tournamentController.getTournaments);

router.route('/upcoming-tournaments').get(auth(), tournamentController.getUpcomingTournamentsDates);

router.route('/:tournamentId').get(auth(), validate(tournamentValidation.getTournament), tournamentController.getTournament);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Tournaments
 *   description: Tournament management and retrieval
 */

/**
 * @swagger
 * /tournaments:
 *   post:
 *     summary: Create a tournament
 *     description: Only users can create tournaments.
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - date
 *               - type
 *             properties:
 *               product:
 *                 type: string
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               date:
 *                  type: date
 *             example:
 *               date: Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)
 *               product: 54de54ded848de4ed
 *               type: vendor_visit
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Tournament'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all tournaments
 *     description: Retrieve all tournaments.
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [search_tournament, vendor_tournament]
 *         description: Tournament type
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Tournament subCategory
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Tournament category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of tournaments
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tournament'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /tournaments/upcoming-tournaments:
 *   get:
 *     summary: Get upcoming-tournaments dates
 *     description: Get a prodcut.
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /tournaments/{tournamentId}:
 *   get:
 *     summary: Get a tournament
 *     description: Get a prodcut.
 *     tags: [Tournaments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tournamentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Tournament id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Tournament'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
