const express = require('express');
const validate = require('../../middlewares/validate');
const cacheMiddleware = require('../../middlewares/cacheMiddleware');
const activityValidation = require('../../validations/activity.validation');
const activityController = require('../../controllers/activity.controller');

const router = express.Router();

router.route('/').get(validate(activityValidation.getActivities), cacheMiddleware(15), activityController.getActivities);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Activity management and retrieval
 */

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get all user activities
 *     description: Retrieve all activities.
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Activity'
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
