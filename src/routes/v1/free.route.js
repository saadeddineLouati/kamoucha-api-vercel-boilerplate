const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const freeValidation = require('../../validations/free.validation');
const freeController = require('../../controllers/free.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');

const router = express.Router();

router.route('/').post(auth(), validate(freeValidation.createFree), freeController.createFree).get(freeController.getFrees);

router
  .route('/:freeId')
  .get(validate(freeValidation.getFree), freeController.getFree)
  .patch(auth(), validate(freeValidation.updateFree), currentUserMiddelware(), freeController.updateFree)
  .delete(auth(), validate(freeValidation.deleteFree), freeController.deleteFree);

router
  .route('/serial-number/:serialNumber')
  .get(validate(freeValidation.getFreeBySerialNumber), currentUserMiddelware(), freeController.getFreeBySerialNumber);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Frees
 *   description: Free management and retrieval
 */

/**
 * @swagger
 * /frees:
 *   post:
 *     summary: Create a free
 *     description: Only users can create frees.
 *     tags: [Frees]
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
 *                $ref: '#/components/schemas/Free'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all frees
 *     description: Retrieve all frees.
 *     tags: [Frees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Free title
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Free description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Free price
 *       - in: query
 *         name: available
 *         schema:
 *           type: booleran
 *         description: Free available
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
 *         description: Maximum number of frees
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
 *                     $ref: '#/components/schemas/Free'
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
 * /frees/{freeId}:
 *   get:
 *     summary: Get a free
 *     description: Get a prodcut.
 *     tags: [Frees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: freeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Free id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Free'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a free
 *     description: Only owner can edit his free.
 *     tags: [Frees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: freeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Free id
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
 *                $ref: '#/components/schemas/Free'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a free
 *     description: Only logged owner and ADMIN can delete a free.
 *     tags: [Frees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: freeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Free id
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
