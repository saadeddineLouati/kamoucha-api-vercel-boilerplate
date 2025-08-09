// /* eslint-disable no-restricted-syntax */
// const fs = require('fs');
// const puppeteer = require('puppeteer');

// async function saveCataloguesToJson(catalogues) {
//   const json = JSON.stringify(catalogues, null, 2);
//   fs.writeFileSync('catalogues.json', json, 'utf8');
// }

// async function scrapeCatalogues(cataloguesArray) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   const catalogues = [];

//   for await (const catalogue of cataloguesArray) {
//     await page.goto(catalogue.url);

//     const catalogueItems = await page.$$('.fg_gallery');

//     let images = [];

//     for await (const item of catalogueItems) {
//       images = await item.$$eval('.gallery-link', (imageElements) => imageElements.map((el) => el.href));
//     }

//     catalogues.push({ ...catalogue, images });
//   }

//   await browser.close();

//   saveCataloguesToJson(catalogues);
//   return catalogues;
// }

// const catalogues = [
//   {
//     merchand: 'Avon Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=avon&msid=98#&gid=2&pid=1',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Fatales Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=fatales&msid=112#&gid=2&pid=1',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Farmasi Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=farmasi&msid=496#&gid=2&pid=1',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Oriflame Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=oriflame&msid=722#&gid=2&pid=2',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Cristianlay Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=cristianlay&msid=100#&gid=2&pid=1',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Arvea Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=arvea&msid=711#&gid=2&pid=1',
//     category: 'habillement-et-bien-être',
//   },
//   {
//     merchand: 'Graiet Tunisie',
//     url: 'https://www.trend.tn/catalogues/?catalogue=graiet&msid=501#&gid=2&pid=1',
//     category: 'Pour-la-maison-et-le-jardin',
//   },
//   {
//     merchand: 'Batam',
//     url: 'https://www.trend.tn/catalogues/?catalogue=batam&msid=1313#&gid=2&pid=1',
//     category: 'Pour-la-maison-et-le-jardin',
//   },
//   {
//     merchand: 'Aziza',
//     url: 'https://www.trend.tn/catalogues/?catalogue=aziza&msid=90#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Aziza',
//     url: 'https://www.trend.tn/catalogues/?catalogue=aziza_1&msid=90#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Carrefour',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefour&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Carrefour',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefourexpress&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Carrefour',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefourmarket&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Carrefour',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefourmarket_2&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Carrefour',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefourmarket_3&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Géant',
//     url: 'https://www.trend.tn/catalogues/?catalogue=carrefourmarket_4&msid=96#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Géant',
//     url: 'https://www.trend.tn/catalogues/?catalogue=geant_2&msid=88#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Magasin général',
//     url: 'https://www.trend.tn/catalogues/?catalogue=magasingenerale&msid=68#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Monoprix',
//     url: 'https://www.trend.tn/catalogues/?catalogue=monoprix&msid=92#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
//   {
//     merchand: 'Monoprix',
//     url: 'https://www.trend.tn/catalogues/?catalogue=monoprix_2&msid=92#&gid=2&pid=1',
//     category: 'restaurants-et-marchands',
//   },
// ];

// scrapeCatalogues(catalogues)
//   .then(() => {
//     // console.log(JSON.stringify(result, null, 2));
//   })
//   .catch(() => {
//     // console.error('Error:', error);
//   });
