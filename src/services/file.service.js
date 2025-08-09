/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
require('dotenv').config();
const fs = require('fs');
const util = require('util');

// Optional PDF conversion - only load if available (avoids canvas issues in serverless)
let pdf2img = null;
try {
  pdf2img = require('pdf-img-convert');
} catch (error) {
  console.warn('pdf-img-convert not available - PDF conversion disabled');
}

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { default: axios } = require('axios');

const bucketName = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const unlinkFile = util.promisify(fs.unlink);

const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  region: process.env.AWS_REGION || 'us-east-1',
});

// UPLOAD FILE TO S3
async function uploadFile(file, key) {
  const fileStream = fs.createReadStream(file.path || file);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename || key,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);
  
  // Return the URL for compatibility
  return {
    Location: `https://${bucketName}.s3.amazonaws.com/${file.filename || key}`
  };
}

// DOWNLOAD FILE FROM S3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

async function uploadImageFromUrl(imageUrl) {
  // Download the image from the provided URL
  const response = await axios.get(imageUrl, { responseType: 'stream' });

  // Generate a random filename for the uploaded image
  const fileName = Date.now().toString();

  // Create a write stream to temporarily store the downloaded image
  const fileStream = fs.createWriteStream(fileName);

  // Pipe the downloaded image to the write stream
  response.data.pipe(fileStream);

  // Wait for the write stream to finish writing the file
  await new Promise((resolve, reject) => {
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });

  // Create the upload parameters for S3
  const uploadParams = {
    Bucket: bucketName,
    Body: fs.createReadStream(fileName),
    Key: fileName,
  };

  // Upload the file to S3
  const uploadResponse = await s3.upload(uploadParams).promise();

  // Delete the temporary file
  fs.unlinkSync(fileName);

  // Return the URL of the uploaded image
  return uploadResponse.Location;
}

async function pdfToImages(url, label = '') {
  try {
    if (!pdf2img) {
      throw new Error('PDF conversion not available - pdf-img-convert module not loaded');
    }
    
    const outputImages1 = await pdf2img.convert(url);
    const outputDir = './out/';
    const imageName = `${label}-`;
    const uploadedImageLinks = [];

    for (let i = 0; i < outputImages1.length; i++) {
      const filePath = `${outputDir}${imageName}${i}.webp`;
      await fs.promises.writeFile(filePath, outputImages1[i]);
      const imageFilePath = `${outputDir}${imageName}${i}.webp`;

      try {
        const uploadedImage = await uploadFile(imageFilePath, `${imageName}${i}.webp`);
        uploadedImageLinks.push(uploadedImage);
      } catch (uploadError) {
        throw new Error(`Error uploading image: ${uploadError}`);
      }
    }

    // Delete generated images
    for (let i = 0; i < outputImages1.length; i++) {
      const filePath = `${outputDir}${imageName}${i}.webp`;
      await unlinkFile(filePath);
    }

    return uploadedImageLinks;
  } catch (e) {
    throw new Error(`Error when converting PDF to images: ${e}`);
  }
}

module.exports = { uploadFile, getFileStream, uploadImageFromUrl, pdfToImages };
