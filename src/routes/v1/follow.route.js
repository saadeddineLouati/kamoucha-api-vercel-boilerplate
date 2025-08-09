const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const followValidation = require('../../validations/follow.validation');
const followController = require('../../controllers/follow.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(followValidation.createFollow), followController.createFollow)
  .get(auth(), validate(followValidation.getFollows), followController.getFollows);

router.route('/followers/:userId').get(auth(), validate(followValidation.getFollow), followController.getFollwers);

router.route('/followed/:userId').get(auth(), validate(followValidation.getFollow), followController.getFollowed);

router.route('/:userId').delete(auth(), validate(followValidation.deleteFollow), followController.unfollowUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: Follow management and retrieval
 */

/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Create a follow
 *     description: Only users can create follows.
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - follower
 *               - followed
 *             properties:
 *               follower:
 *                 type: string
 *               followed:
 *                 type: string
 *             example:
 *               follower: 15fr5f4fr98e9e5de59d
 *               followed: 15fr5f4fr98e9e5de59d
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Follow'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all follows
 *     description: Retrieve all follows.
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: follower
 *         schema:
 *           type: string
 *         description: user
 *       - in: query
 *         name: followed
 *         schema:
 *           type: string
 *         description: user
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
 *         description: Maximum number of follows
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
 *                     $ref: '#/components/schemas/Follow'
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
 * /follows/followers/{userId}:
 *   get:
 *     summary: Get followers
 *     description: Only logged owner and ADMIN can delete a follow.
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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

/**
 * @swagger
 * /follows/followed/{userId}:
 *   get:
 *     summary: Get followed
 *     description: Only logged owner and ADMIN can delete a follow.
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
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

/**
 * @swagger
 * /follows/{userId}:
 *   delete:
 *     summary: Delete a follow
 *     description: Only logged owner and ADMIN can delete a follow.
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
