const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const alertValidation = require('../../validations/alert.validation');
const alertController = require('../../controllers/alert.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(alertValidation.createAlert), alertController.createAlert)
  .get(auth(), validate(alertValidation.getAlerts), alertController.getAlerts);

router
  .route('/:alertId')
  .get(auth(), validate(alertValidation.getAlert), alertController.getAlert)
  .patch(auth(), validate(alertValidation.updateAlert), alertController.updateAlert)
  .delete(auth(), validate(alertValidation.deleteAlert), alertController.deleteAlert);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Alerts
 *   description: Alert management and retrieval
 */

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create a alert
 *     description: Only users can create alerts.
 *     tags: [Alerts]
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
 *               user:
 *                 type: string
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               user: 15fr5f4fr98e9e5de59d
 *               type: vendor_alert
 *               subCategory: smartphones
 *               category: technology
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Alert'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all alerts
 *     description: Retrieve all alerts.
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [search_alert, vendor_alert]
 *         description: Alert type
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Alert subCategory
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Alert category
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
 *         description: Maximum number of alerts
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
 *                     $ref: '#/components/schemas/Alert'
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
 * /alerts/{alertId}:
 *   get:
 *     summary: Get a alert
 *     description: Get a prodcut.
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Alert'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a alert
 *     description: Only owner can edit his alert.
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               user: 15fr5f4fr98e9e5de59d
 *               type: vendor_alert
 *               subCategory: smartphones
 *               category: technology
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Alert'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a alert
 *     description: Only logged owner and ADMIN can delete a alert.
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Alert id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
