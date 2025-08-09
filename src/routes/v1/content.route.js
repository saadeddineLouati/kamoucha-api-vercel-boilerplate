const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contentValidation = require('../../validations/content.validation');
const contentController = require('../../controllers/content.controller');
const cacheMiddleware = require('../../middlewares/cacheMiddleware');

const router = express.Router();

router
  .route('/')
  .post(validate(contentValidation.createContent), contentController.createContent)
  .get(validate(contentValidation.getContent), cacheMiddleware(60 * 15), contentController.getContent);

router
  .route('/:contentId')
  .get(validate(contentValidation.getContentByID), cacheMiddleware(60), contentController.getContentById)
  .patch(auth('update_content'), validate(contentValidation.updateContent), contentController.updateContent)
  .delete(auth('delete_content'), validate(contentValidation.deleteContent), contentController.deleteContent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management and retrieval
 */

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Create a content
 *     description: Only users can create content.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - type
 *             properties:
 *               date:
 *                 type: date
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               date: Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)
 *               type: vendor_content
 *               subCategory: smartphones
 *               category: technology
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Content'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all content
 *     description: Retrieve all content.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [index_slider_1, index_slider_2, index_slider_3, index_slider_4, category_order_1, category_order_2, category_order_3, category_order_4]
 *         description: Content type
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Content subCategory
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Content category
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
 *         description: Maximum number of content
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
 *                     $ref: '#/components/schemas/Content'
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
 * /content/{contentId}:
 *   get:
 *     summary: Get a content
 *     description: Get a prodcut.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Content'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a content
 *     description: Only owner can edit his content.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Content id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: date
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               date: Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)
 *               type: vendor_content
 *               subCategory: smartphones
 *               category: technology
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Content'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a content
 *     description: Only logged owner and ADMIN can delete a content.
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Content id
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
