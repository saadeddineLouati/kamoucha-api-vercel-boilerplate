const express = require('express');
const auth = require('../../middlewares/auth');
const visitController = require('../../controllers/visit.controller');

const router = express.Router();

router.route('/').post(auth(), visitController.createVisit).get(auth(), visitController.getVisits);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Visits
 *   description: Visit management and retrieval
 */

/**
 * @swagger
 * /visits:
 *   post:
 *     summary: Create a visit
 *     description: Only users can create visits.
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - type
 *             properties:
 *               product:
 *                 type: string
 *               user:
 *                 type: string
 *               vendor:
 *                 type: string
 *               type:
 *                  type: date
 *             example:
 *               product: 5fr5fr1f5e1ez5
 *               user: def4r554r5f4rf
 *               type: product_visit
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Visit'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all visits
 *     description: Retrieve all visits.
 *     tags: [Visits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [product_visit, vendor_visit]
 *         description: Visit type
 *       - in: query
 *         name: prodcut
 *         schema:
 *           type: string
 *         description: Visit prodcut
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Visit user
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Visit vendor
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
 *         description: Maximum number of visits
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
 *                     $ref: '#/components/schemas/Visit'
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
