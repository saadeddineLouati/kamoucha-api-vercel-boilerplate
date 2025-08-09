const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const discussionValidation = require('../../validations/discussion.validation');
const discussionController = require('../../controllers/discussion.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(discussionValidation.createDiscussion), discussionController.createDiscussion)
  .get(validate(discussionValidation.getDiscussions), discussionController.getDiscussions);

router
  .route('/:discussionId')
  .get(validate(discussionValidation.getDiscussion), discussionController.getDiscussion)
  .patch(
    auth(),
    validate(discussionValidation.updateDiscussion),
    currentUserMiddelware(),
    discussionController.updateDiscussion
  )
  .delete(auth(), validate(discussionValidation.deleteDiscussion), discussionController.deleteDiscussion);

router
  .route('/serial-number/:serialNumber')
  .get(
    validate(discussionValidation.getDiscussionBySerialNumber),
    currentUserMiddelware(),
    discussionController.getDiscussionBySerialNumber
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Discussions
 *   description: Discussion management and retrieval
 */

/**
 * @swagger
 * /discussions:
 *   post:
 *     summary: Create a discussion
 *     description: Only users can create discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - role
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                  type: boolean
 *                  enum: [true, false]
 *             example:
 *               title: IPHONE 13 PRO MAX
 *               description: Reprehenderit magna ex excepteur deserunt deserunt. Officia esse et officia nulla in. Reprehenderit qui sint nostrud esse. Excepteur eiusmod sunt ipsum nostrud anim aute do laboris ea amet. Id consectetur ut cupidatat mollit.
 *               price: 120
 *               available: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Discussion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all discussions
 *     description: Retrieve all discussions.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Discussion title
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Discussion description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Discussion price
 *       - in: query
 *         name: available
 *         schema:
 *           type: booleran
 *         description: Discussion available
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
 *         description: Maximum number of discussions
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
 *                     $ref: '#/components/schemas/Discussion'
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
 * /discussions/{discussionId}:
 *   get:
 *     summary: Get a discussion
 *     description: Get a prodcut.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Discussion id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Discussion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a discussion
 *     description: Only owner can edit his discussion.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Discussion id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               available:
 *                  type: boolean
 *                  enum: [true, false]
 *             example:
 *               title: IPHONE 13 PRO MAX
 *               description: Reprehenderit magna ex excepteur deserunt deserunt. Officia esse et officia nulla in. Reprehenderit qui sint nostrud esse. Excepteur eiusmod sunt ipsum nostrud anim aute do laboris ea amet. Id consectetur ut cupidatat mollit.
 *               price: 120
 *               available: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Discussion'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a discussion
 *     description: Only logged owner and ADMIN can delete a discussion.
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: discussionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Discussion id
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
