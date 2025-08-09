const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const addressValidation = require('../../validations/address.validation');
const addressController = require('../../controllers/address.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(addressValidation.createAddress), addressController.createAddress)
  .get(auth(), validate(addressValidation.getAddresses), addressController.getAddresses);

router
  .route('/:addressId')
  .get(auth(), validate(addressValidation.getAddress), addressController.getAddress)
  .patch(auth(), validate(addressValidation.updateAddress), addressController.updateAddress)
  .delete(auth(), validate(addressValidation.deleteAddress), addressController.deleteAddress);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: address management and retrieval
 */

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create a address
 *     description: Only users can create addresses.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - street
 *             properties:
 *                name:
 *                  type: string
 *                street:
 *                  type: string
 *                postalCode:
 *                  type: string
 *                town:
 *                  type: string
 *                country:
 *                  type: string
 *                phoneNumber:
 *                  type: string
 *                metadata:
 *                  type: object
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
 *                $ref: '#/components/schemas/Address'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all addresses
 *     description: Retrieve all addresses.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: address title
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: address description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: address price
 *       - in: query
 *         name: available
 *         schema:
 *           type: booleran
 *         description: address available
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
 *         description: Maximum number of addresses
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
 *                     $ref: '#/components/schemas/Address'
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
 * /addresses/{addressId}:
 *   get:
 *     summary: Get an address
 *     description: Get an address by id.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: address id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Address'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a address
 *     description: Only owner can edit his address.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: address id
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
 *               name: Main address
 *               street: 12 Rue Botzaris
 *               postalCode: 75751
 *               town: Paris
 *               country: France
 *               phoneNumber: 0033756312598
 *               metadata: {}
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Address'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a address
 *     description: Only logged owner and ADMIN can delete a address.
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: address id
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
