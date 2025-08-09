const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');
const cacheMiddleware = require('../../middlewares/cacheMiddleware');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.createComment), commentController.createComment)
  .get(validate(commentValidation.getComments), cacheMiddleware(15), commentController.getComments);

router
  .route('/:commentId')
  .get(auth(), validate(commentValidation.getComment), commentController.getComment)
  .patch(auth(), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteComment);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management and retrieval
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a comment
 *     description: Only users can create comments.
 *     tags: [Comments]
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
 *                  enum: [product_comment, vendor_comment, auto_comment]
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
 *                 type: vendor_comment
 *                 value: 4
 *                 comment: Very kind vendor
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Comment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all comments
 *     description: Retrieve all comments.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Commented product
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Comment author
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Commented vendor
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           required: true
 *           enum:
 *              - product_comment
 *              - vendor_comment
 *              - auto_comment
 *         description: Comment type
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         description: Comment value
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
 *         description: Maximum number of comments
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
 *                     $ref: '#/components/schemas/Comment'
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
 * /comments/{commentId}:
 *   get:
 *     summary: Get a comment
 *     description: Get a prodcut.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Comment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a comment
 *     description: Only owner can edit his comment.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment id
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
 *                  enum: [product_comment, vendor_comment]
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
 *                 type: vendor_comment
 *                 value: 4
 *                 comment: Very kind vendor
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Comment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a comment
 *     description: Only logged owner and ADMIN can delete a comment.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment id
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
