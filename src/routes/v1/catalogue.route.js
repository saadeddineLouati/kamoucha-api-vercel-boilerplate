const express = require('express');
const validate = require('../../middlewares/validate');
const catalogueValidation = require('../../validations/catalogue.validation');
const catalogueController = require('../../controllers/catalogue.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(validate(catalogueValidation.getCatalogues), catalogueController.getCatalogues)
  .post(auth('manageCatalogues'), validate(catalogueValidation.createCatalogue), catalogueController.createCatalogue);

router
  .route('/:catalogueId')
  .get(validate(catalogueValidation.getCatalogue), currentUserMiddelware(), catalogueController.getCatalogue);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Catalogues
 *   description: Catalogue management and retrieval
 */

/**
 * @swagger
 * /catalogues:
 *   get:
 *     summary: Get all catalogues
 *     description: Retrieve all catalogues.
 *     tags: [Catalogues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Catalogue title
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Catalogue description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Catalogue price
 *       - in: query
 *         name: available
 *         schema:
 *           type: booleran
 *         description: Catalogue available
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
 *         description: Maximum number of catalogues
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
 *                     $ref: '#/components/schemas/Catalogue'
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
