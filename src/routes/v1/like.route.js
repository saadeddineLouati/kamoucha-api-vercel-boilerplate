const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const likeValidation = require('../../validations/like.validation');
const likeController = require('../../controllers/like.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(likeValidation.createLike), likeController.createLike)
  .get(validate(likeValidation.getLikes), likeController.getLikes);

router.route('/:type/:postId').delete(auth(), validate(likeValidation.deleteLike), likeController.deleteLike);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management and retrieval
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Create a like
 *     description: Only users can create likes.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - POST
 *               - user
 *               - postType
 *               - STATUS
 *             properties:
 *               product:
 *                 type: string
 *               user:
 *                 type: string
 *               vendor:
 *                 type: number
 *               type:
 *                  type: string
 *                  enum: [product_like, vendor_like, auto_like]
 *               value:
 *                 type: number
 *               like:
 *                 type: string
 *               metadata:
 *                 type: string
 *             example:
 *                 product: 5ebac534954b54139806c112
 *                 user: 5ebac534954b54139806c112
 *                 vendor: 5ebac534954b54139806c112
 *                 type: vendor_like
 *                 value: 4
 *                 like: Very kind vendor
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Like'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all likes
 *     description: Retrieve all likes.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Likeed product
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Like author
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Likeed vendor
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           required: true
 *           enum:
 *              - product_like
 *              - vendor_like
 *              - auto_like
 *         description: Like type
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: Like value
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
 *         description: Maximum number of likes
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
 *                     $ref: '#/components/schemas/Like'
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
 * /likes/{postId}:
 *   delete:
 *     summary: Delete a like
 *     description: Only logged owner and ADMIN can delete a like.
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: likeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Like id
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
