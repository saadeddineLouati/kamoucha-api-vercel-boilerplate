const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(chatValidation.createChat), chatController.createChat)
  .get(auth(), validate(chatValidation.getChats), chatController.getChats);

router.route('/conversations').get(auth(), chatController.getMyConversations);

router.route('/:user').get(auth(), validate(chatValidation.getChat), chatController.getChat);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat management and retrieval
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a chat
 *     description: Only users can create chats.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - sender
 *               - receiver
 *               - product
 *               - status
 *             properties:
 *               message:
 *                 type: string
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *               product:
 *                  type: string
 *               status:
 *                  type: string
 *                  enum: [is_sent, is_seen]
 *             example:
 *               message: Hello bro!
 *               sender: vendor_chat
 *               receiver: smartphones
 *               product: smartphones
 *               status: is_sent
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Chat'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all chats
 *     description: Retrieve all chats.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [is_sent, is_seen]
 *         description: Chat status
 *       - in: query
 *         name: product
 *         schema:
 *           type: string
 *         description: Chat product
 *       - in: query
 *         name: receiver
 *         schema:
 *           type: string
 *         description: Chat receiver
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *         description: Chat sender
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
 *         description: Maximum number of chats
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
 *                     $ref: '#/components/schemas/Chat'
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
 * /chats/conversations:
 *   get:
 *     summary: Get a chat
 *     description: Get a prodcut.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Chat'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /chats/{user}:
 *   get:
 *     summary: Get a chat
 *     description: Get a prodcut.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Chat'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
