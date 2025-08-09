const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const promocodeValidation = require('../../validations/promocode.validation');
const promocodeController = require('../../controllers/promocode.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(promocodeValidation.createPromocode), promocodeController.createPromocode)
  .get(validate(promocodeValidation.getPromocodes), currentUserMiddelware(), promocodeController.getPromocodes);

router
  .route('/:promocodeId')
  .get(validate(promocodeValidation.getPromocode), promocodeController.getPromocode)
  .patch(auth(), validate(promocodeValidation.updatePromocode), currentUserMiddelware(), promocodeController.updatePromocode)
  .delete(auth(), validate(promocodeValidation.deletePromocode), promocodeController.deletePromocode);

router
  .route('/serial-number/:serialNumber')
  .get(
    validate(promocodeValidation.getPromoCodeBySerialNumber),
    currentUserMiddelware(),
    promocodeController.getPromoCodeBySerialNumber
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Promo codes
 *   description: Promocode management and retrieval
 */

/**
 * @swagger
 * /promo-codes:
 *   post:
 *     summary: Create a promocode
 *     description: Only users can create promocodes.
 *     tags: [Promo codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - copies
 *               - type
 *             properties:
 *               user:
 *                 type: string
 *               product:
 *                 type: string
 *               copies:
 *                 type: number
 *               value:
 *                 type: number
 *               expiringDate:
 *                 type: date
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               user: 15fr5f4fr98e9e5de59d
 *               product: 15fr5f4fr98e9e5de59d
 *               value: 10
 *               copies: 10
 *               type: vendor_promocode
 *               subCategory: smartphones
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Promocode'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all promocodes
 *     description: Retrieve all promocodes.
 *     tags: [Promo codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Promocode owner
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Promocode name
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
 *         description: Maximum number of promocodes
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
 *                     $ref: '#/components/schemas/Promocode'
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
 * /promo-codes/{promocodeId}:
 *   get:
 *     summary: Get a promocode
 *     description: Get a prodcut.
 *     tags: [Promo codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: promocodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Promocode id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Promocode'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a promocode
 *     description: Only owner can edit his promocode.
 *     tags: [Promo codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: promocodeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Promocode id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               type:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *               copies:
 *                  type: number
 *               expiringDate:
 *                  type: date
 *             example:
 *               user: 15fr5f4fr98e9e5de59d
 *               product: 15fr5f4fr98e9e5de59d
 *               copies: 10
 *               type: vendor_promocode
 *               subCategory: smartphones
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Promocode'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a promocode
 *     description: Only logged owner and ADMIN can delete a promocode.
 *     tags: [Promo codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promocode id
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
