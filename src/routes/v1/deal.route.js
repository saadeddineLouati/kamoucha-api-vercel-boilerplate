const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const dealValidation = require('../../validations/deal.validation');
const dealController = require('../../controllers/deal.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');

const router = express.Router();

router.route('/').post(auth(), validate(dealValidation.createDeal), dealController.createDeal).get(dealController.getDeals);

router
  .route('/:dealId')
  .get(validate(dealValidation.getDeal), dealController.getDeal)
  .patch(auth(), validate(dealValidation.updateDeal), currentUserMiddelware(), dealController.updateDeal)
  .delete(auth(), validate(dealValidation.deleteDeal), dealController.deleteDeal);

router
  .route('/serial-number/:serialNumber')
  .get(validate(dealValidation.getDealBySerialNumber), currentUserMiddelware(), dealController.getDealBySerialNumber);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Deals
 *   description: Deal management and retrieval
 */

/**
 * @swagger
 * /deals:
 *   post:
 *     summary: Create a deal
 *     description: Only users can create deals.
 *     tags: [Deals]
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
 *                $ref: '#/components/schemas/Deal'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all deals
 *     description: Retrieve all deals.
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Deal title
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Deal description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Deal price
 *       - in: query
 *         name: available
 *         schema:
 *           type: booleran
 *         description: Deal available
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
 *         description: Maximum number of deals
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
 *                     $ref: '#/components/schemas/Deal'
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
 * /deals/{dealId}:
 *   get:
 *     summary: Get a deal
 *     description: Get a prodcut.
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dealId
 *         required: true
 *         schema:
 *           type: string
 *         description: Deal id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Deal'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a deal
 *     description: Only owner can edit his deal.
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dealId
 *         required: true
 *         schema:
 *           type: string
 *         description: Deal id
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
 *                $ref: '#/components/schemas/Deal'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a deal
 *     description: Only logged owner and ADMIN can delete a deal.
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dealId
 *         required: true
 *         schema:
 *           type: string
 *         description: Deal id
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
