const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const boostValidation = require('../../validations/boost.validation');
const boostController = require('../../controllers/boost.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(boostValidation.createBoost), boostController.createBoost)
  .get(auth(), validate(boostValidation.getBoosts), boostController.getBoosts);

router.route('/upcoming-boosts').get(auth(), boostController.getUpcomingBoostsDates);

router.route('/:boostId').get(auth(), validate(boostValidation.getBoost), boostController.getBoost);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Boosts
 *   description: Boost management and retrieval
 */

/**
 * @swagger
 * /boosts:
 *   post:
 *     summary: Create a boost
 *     description: Only users can create boosts.
 *     tags: [Boosts]
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
 *                $ref: '#/components/schemas/Boost'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all boosts
 *     description: Retrieve all boosts.
 *     tags: [Boosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [search_boost, vendor_boost]
 *         description: Boost type
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Boost subCategory
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Boost category
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
 *         description: Maximum number of boosts
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
 *                     $ref: '#/components/schemas/Boost'
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
 * /boosts/upcoming-boosts:
 *   get:
 *     summary: Get upcoming-boosts dates
 *     description: Get a prodcut.
 *     tags: [Boosts]
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
 * /boosts/{boostId}:
 *   get:
 *     summary: Get a boost
 *     description: Get a prodcut.
 *     tags: [Boosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boostId
 *         required: true
 *         schema:
 *           type: string
 *         description: Boost id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Boost'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
