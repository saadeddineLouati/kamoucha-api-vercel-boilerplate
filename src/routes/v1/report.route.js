const express = require('express');
const auth = require('../../middlewares/auth');
const reportController = require('../../controllers/report.controller');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');
const currentUserMiddelware = require('../../middlewares/currentUser');

const router = express.Router();

router
  .route('/')
  .post(validate(reportValidation.createReport), currentUserMiddelware(), reportController.createReport)
  .get(auth(), validate(reportValidation.getReportes), reportController.getReports);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management and retrieval
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a report
 *     description: Only users can create reports.
 *     tags: [Reports]
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
 *               type: product_report
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Report'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all reports
 *     description: Retrieve all reports.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [product_report, vendor_report]
 *         description: Report type
 *       - in: query
 *         name: prodcut
 *         schema:
 *           type: string
 *         description: Report prodcut
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Report user
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Report vendor
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
 *         description: Maximum number of reports
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
 *                     $ref: '#/components/schemas/Report'
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
