// eslint-disable-next-line import/order
const express = require('express');

const router = express.Router();

const fs = require('fs');
const util = require('util');
const upload = require('../../utils/common');
const { uploadFile, getFileStream, pdfToImages } = require('../../services/file.service');

const unlinkFile = util.promisify(fs.unlink);

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/images/:key', (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);
  readStream.pipe(res);
});

router.post('/single', upload.single('image'), async (req, res) => {
  try {
    // uploading to AWS S3
    const result = await uploadFile(req.file);

    // You may apply filter, resize image before sending to client

    // Deleting from local if uploaded in S3 bucket
    await unlinkFile(req.file.path);

    res.send({
      status: 'success',
      message: 'File uploaded successfully',
      data: result,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

router.post('/multiple', upload.array('images'), async (req, res) => {
  try {
    let response = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const file of req.files) {
      const result = await uploadFile(file);
      if (file.mimetype === 'application/pdf') {
        const conversionResults = await pdfToImages(result.Location, file.originalname);
        response = [...response, ...conversionResults];
      } else {
        response.push(result);
      }
      await unlinkFile(file.path);
    }
    res.send({
      status: 'success',
      message: 'Files uploaded successfully',
      data: response,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: Files managment
 */

/**
 * @swagger
 * /files/multiple:
 *   post:
 *     summary: Upload files
 *     description: Only users can upload files.
 *     tags: [Files]
 *     consumes:
 *      - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: file
 *                   format: binary
 *     security:
 *       - bearerAuth: []
 */
