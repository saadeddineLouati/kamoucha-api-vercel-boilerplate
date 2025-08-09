const express = require('express');
const validate = require('../../middlewares/validate');
const contactMessageValidation = require('../../validations/contact-message.validation');
const contactMessageController = require('../../controllers/contact-message.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(contactMessageValidation.createContactMessage), contactMessageController.createContactMessage);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: ContactMessagees
 *   description: contactMessage management and retrieval
 */

/**
 * @swagger
 * /contactMessagees:
 *   post:
 *     summary: Create a contactMessage
 *     description: Only users can create contactMessagees.
 *     tags: [ContactMessagees]
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
 *                $ref: '#/components/schemas/ContactMessage'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
