const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const searchValidation = require('../../validations/search.validation');
const searchController = require('../../controllers/search.controller');
const currentUserMiddelware = require('../../middlewares/currentUser');
const cacheMiddleware = require('../../middlewares/cacheMiddleware');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(searchValidation.createSearch), searchController.createSearch)
  .get(auth(), validate(searchValidation.getSearches), searchController.getSearches);

router.route('/delete-all').delete(auth(), searchController.deleteAllUserSearchess);

router
  .route('/:searchId')
  .get(auth(), validate(searchValidation.getSearch), searchController.getSearch)
  .patch(auth(), validate(searchValidation.updateSearch), searchController.updateSearch)
  .delete(auth(), validate(searchValidation.deleteSearch), searchController.deleteSearch);

router.route('/keyword/:keyword').get(validate(searchValidation.findByKeyWordAndPage), searchController.findByKeyWord);

router
  .route('/:postType/:keyword')
  .get(
    validate(searchValidation.findByKeyWordAndPostType),
    currentUserMiddelware(),
    cacheMiddleware(60),
    searchController.findByKeyWordAndPostType
  );
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Searches
 *   description: Search management and retrieval
 */

/**
 * @swagger
 * /searches:
 *   post:
 *     summary: Create a search
 *     description: Only users can create searches.
 *     tags: [Searches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *               query:
 *                  type: object
 *             example:
 *               type: VENDOR_SEARCH_TYPE
 *               query: {category}
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Search'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all searches
 *     description: Retrieve all searches.
 *     tags: [Searches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Search subCategory
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Search category
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
 *         description: Maximum number of searches
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
 *                     $ref: '#/components/schemas/Search'
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
 * /searches/{searchId}:
 *   get:
 *     summary: Get a search
 *     description: Get a prodcut.
 *     tags: [Searches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Search id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Search'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a search
 *     description: Only owner can edit his search.
 *     tags: [Searches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchId
 *         required: true
 *         schema:
 *           type: string
 *         description: Search id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subCategory:
 *                 type: string
 *               category:
 *                  type: string
 *             example:
 *               subCategory: smartphones
 *               category: technology
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Search'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a search
 *     description: Only logged owner and ADMIN can delete a search.
 *     tags: [Searches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Search id
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
