const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const favouriteValidation = require('../../validations/favourite.validation');
const favouriteController = require('../../controllers/favourite.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(favouriteValidation.createFavourite), favouriteController.createFavourite)
  .get(auth(), favouriteController.getFavouriteByUser);

router.route('/delete-all').delete(auth(), favouriteController.deleteAllUserFavourites);

router.route('/:post').delete(auth(), validate(favouriteValidation.deleteFavourite), favouriteController.deleteFavourite);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: Favourite management and retrieval
 */

/**
 * @swagger
 * /favourites:
 *   post:
 *     summary: Create a favourite
 *     description: Only users can create favourites.
 *     tags: [Favourites]
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
 *             properties:
 *               product:
 *                 type: string
 *             example:
 *               product: 620975881a359485e06d4ad1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Favourite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all user favourites
 *     description: Retrieve all favourites.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
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
 *                     $ref: '#/components/schemas/Favourite'
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
 * /favourites/{favouriteId}:
 *   delete:
 *     summary: Delete a favourite
 *     description: Only logged owner and ADMIN can delete a favourite.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favouriteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Favourite id
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
 * /favourites/delete-all:
 *   delete:
 *     summary: Delete all user favourite
 *     description: Only logged owner and ADMIN can delete a favourite.
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
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
