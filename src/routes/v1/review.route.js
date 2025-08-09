const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/:reviewId')
  .get(auth(), validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management and retrieval
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review
 *     description: Only users can create reviews.
 *     tags: [Reviews]
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
 *               - user
 *               - type
 *               - value
 *             properties:
 *               product:
 *                 type: string
 *               user:
 *                 type: string
 *               vendor:
 *                 type: number
 *               type:
 *                  type: string
 *                  enum: [product_review, vendor_review, auto_review]
 *               value:
 *                 type: number
 *               comment:
 *                 type: string
 *               metadata:
 *                 type: string
 *             example:
 *                 product: 5ebac534954b54139806c112
 *                 user: 5ebac534954b54139806c112
 *                 vendor: 5ebac534954b54139806c112
 *                 type: vendor_review
 *                 value: 4
 *                 comment: Very kind vendor
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all reviews
 *     description: Retrieve all reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Reviewed product
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Review author
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Reviewed vendor
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           required: true
 *           enum:
 *              - product_review
 *              - vendor_review
 *              - auto_review
 *         description: Review type
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: Review value
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
 *         description: Maximum number of reviews
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
 *                     $ref: '#/components/schemas/Review'
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
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get a review
 *     description: Get a prodcut.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a review
 *     description: Only owner can edit his review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               user:
 *                 type: string
 *               vendor:
 *                 type: number
 *               type:
 *                  type: string
 *                  enum: [product_review, vendor_review]
 *               value:
 *                 type: number
 *               comment:
 *                 type: string
 *               metadata:
 *                 type: string
 *             example:
 *                 product: 5ebac534954b54139806c112
 *                 user: 5ebac534954b54139806c112
 *                 vendor: 5ebac534954b54139806c112
 *                 type: vendor_review
 *                 value: 4
 *                 comment: Very kind vendor
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a review
 *     description: Only logged owner and ADMIN can delete a review.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review id
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
