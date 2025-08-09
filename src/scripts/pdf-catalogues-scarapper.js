// /* eslint-disable no-plusplus */
// /* eslint-disable no-console */
// /* eslint-disable no-restricted-syntax */
// const fs = require('fs');
// const pdf2img = require('pdf-img-convert');
// const { uploadFile } = require('../services/file.service');
// const { createCatalogue } = require('../services/catalogue.service');

// const catalogues = [
//   {
//     url: './src/scripts/Catalogue Monoprix du 08-08-2023 au 27-08-2023 (1) (1).pdf',
//     label: "Spécial Rentrée",
//     merchand: 'Monoprix',
//     category: 'restaurants-et-marchands',
//   }
// ];

// const ingestCataloguesFromPdf = async () => {
//   for await (const catalogue of catalogues) {
//     try {
//       console.log(catalogue)
//       const outputImages1 = await pdf2img.convert(catalogue.url);
//       console.log(outputImages1.length);
//       const outputDir = './out/';
//       const imageName = `${catalogue.label}-`;
//       const uploadedImageLinks = [];
//       console.log(outputImages1.length)
//       for await (const [i, value] of outputImages1.entries()) {
//         const filePath = `${outputDir}${imageName}${i}.webp`;
//         fs.writeFile(filePath, outputImages1[i], async function (error) {
//           if (error) {
//             console.error(`Error writing file: ${error}`);
//           } else {
//             const imageFilePath = `${outputDir}${imageName}${i}.webp`;
//             console.log(imageName)
//             const uploadedImage = await uploadFile(imageFilePath, `${imageName}${i}.webp`);
//             uploadedImageLinks[i] = uploadedImage.Location;
//             if (uploadedImageLinks.filter(e => e !== null || e !== undefined).length === outputImages1.length) {
//               const result = await createCatalogue({
//                 merchand: catalogue.merchand,
//                 images: uploadedImageLinks,
//                 category: catalogue.category,
//                 label: catalogue.label,
//               });
//               console.log(result);
//             }
//           }
//         });
//       }
//     } catch {
//       (e) => { console.log(e) }
//     }
//   }
// };

// module.exports = { ingestCataloguesFromPdf };
