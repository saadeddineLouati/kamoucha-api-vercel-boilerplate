const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const newsletterValidation = require('../../validations/newsletter.validation');
const newsletterController = require('../../controllers/newsletter.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(newsletterValidation.createNewsletter), newsletterController.createNewsletter)
  .get(validate(newsletterValidation.getNewsletteres), newsletterController.getNewsletters);

router
  .route('/:newsletterId')
  .delete(auth(), validate(newsletterValidation.deleteNewsletter), newsletterController.deleteNewsletter);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Newsletters
 *   description: Newsletter management and retrieval
 */

/**
 * @swagger
 * /newsletters:
 *   post:
 *     summary: Create a newsletter
 *     description: Only users can create newsletters.
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                  type: string
 *             example:
 *               email: saadlouatiii@gmail.com
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Newsletter'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all newsletters
 *     description: Retrieve all newsletters.
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Newsletter email
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
 *         description: Maximum number of newsletters
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
 *                     $ref: '#/components/schemas/Newsletter'
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
 * /newsletters/{newsletterId}:
 *   delete:
 *     summary: Delete a newsletter
 *     description: Only logged owner and ADMIN can delete a newsletter.
 *     tags: [Newsletters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Newsletter id
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
