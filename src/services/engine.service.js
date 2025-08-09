/* eslint-disable no-case-declarations */
const Deal = require('../models/deal.model');
const Free = require('../models/free.model');
const PromoCode = require('../models/promocode.model');
const Discussion = require('../models/discussion.model');
const { mergeAndSort } = require('../utils/vanilla');
const { dealService, freeService, discussionService, promocodeService } = require('.');

// /**
//  * Find posts by keyword and postType
//  * @param {String} keyword
//  * @param {String} postType
//  * @returns {Promise<any>}
//  */
// const findByKeyWordAndPostType = async (keyword, postType, page = 2, limit = 2) => {
//   const sort = { score: -1, createdAt: -1 };
//   const select = '_id url title';
//   const skip = (page - 1) * limit;
//   const query = {
//     // $or: [
//     //   { title: { $regex: keyword, $options: 'i' } },
//     //   { category: { $regex: keyword, $options: 'i' } },
//     //   { subCategory: { $regex: keyword, $options: 'i' } },
//     //   { description: { $regex: keyword, $options: 'i' } },
//     //   { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
//     // ],
//   };
//   const results = {
//     Free: [],
//     Discussion: [],
//     PromoCode: [],
//     Deal: [],
//   };
//   let totalPages = 0;

//   switch (postType) {
//     case 'Deal':
//       results.Deal = await Deal.find(query).sort(sort).populate('post').populate('user').select(select).limit(limit);
//       if (Math.ceil((await Deal.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Deal.countDocuments(query)) / limit);
//       break;
//     case 'Free':
//       results.Free = await Free.find(query).sort(sort).populate('post').populate('user').select(select).limit(limit);
//       if (Math.ceil((await Free.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Free.countDocuments(query)) / limit);
//       break;
//     case 'Discussion':
//       results.Discussion = await Discussion.find(query)
//         .sort(sort)
//         .populate('post')
//         .populate('user')
//         .select(select)
//         .skip(skip)
//         .limit(limit);
//       if (Math.ceil((await Discussion.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Discussion.countDocuments(query)) / limit);
//       break;
//     case 'PromoCode':
//       results.PromoCode = await PromoCode.find(query)
//         .sort(sort)
//         .populate('post')
//         .populate('user')
//         .select(select)
//         .skip(skip)
//         .limit(limit);
//       if (Math.ceil((await PromoCode.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await PromoCode.countDocuments(query)) / limit);
//       break;
//     default:
//       results.Deal = await Deal.find(query).sort(sort).populate('post').populate('user').skip(skip).limit(limit);
//       results.Free = await Free.find(query).sort(sort).populate('post').populate('user').skip(skip).limit(limit);
//       results.Discussion = await Discussion.find(query).sort(sort).populate('post').populate('user').skip(skip).limit(limit);
//       results.PromoCode = await PromoCode.find(query).sort(sort).populate('post').populate('user').skip(skip).limit(limit);
//       if (Math.ceil((await Deal.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Deal.countDocuments(query)) / limit);
//       if (Math.ceil((await Free.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Free.countDocuments(query)) / limit);
//       if (Math.ceil((await Discussion.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await Discussion.countDocuments(query)) / limit);
//       if (Math.ceil((await PromoCode.countDocuments(query)) / limit) > totalPages)
//         totalPages = Math.ceil((await PromoCode.countDocuments(query)) / limit);
//       break;
//   }

//   return { results: mergeAndSort(results), totalPages };
// };

/**
 * Find posts by keyword
 * @param {String} keyword
 * @param {String} postType
 * @returns {Promise<any>}
 */
const findByKeyWord = async (keyword, page, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = {
    // $or: [
    //   { title: { $regex: keyword, $options: 'i' } },
    //   { category: { $regex: keyword, $options: 'i' } },
    //   { subCategory: { $regex: keyword, $options: 'i' } },
    //   { description: { $regex: keyword, $options: 'i' } },
    //   { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
    // ],
  };

  // Query each collection separately
  const results1 = await Deal.find(query).skip(skip).limit(limit);
  const count1 = await Deal.countDocuments(query);
  const results2 = await Free.find(query).skip(skip).limit(limit);
  const count2 = await Free.countDocuments(query);
  const results3 = await Discussion.find(query).skip(skip).limit(limit);
  const count3 = await Discussion.countDocuments(query);
  const results4 = await PromoCode.find(query).skip(skip).limit(limit);
  const count4 = await PromoCode.countDocuments(query);

  // Merge results from all collections
  const mergedResults = [...results1, ...results2, ...results3, ...results4];

  // Sort merged results by date
  mergedResults.sort((a, b) => b.createdAt - a.createdAt);

  // Compute total count and number of pages
  const totalCount = count1 + count2 + count3 + count4;
  const totalPages = Math.ceil(totalCount / limit);

  // Handle cases where a collection has fewer items than the limit
  if (mergedResults.length < limit && page <= totalPages) {
    const remainingResults = await Promise.all([
      Deal.find(query)
        .skip(skip + count1)
        .limit(limit - results1.length),
      Free.find(query)
        .skip(skip + count2)
        .limit(limit - results2.length),
      Discussion.find(query)
        .skip(skip + count3)
        .limit(limit - results3.length),
      PromoCode.find(query)
        .skip(skip + count4)
        .limit(limit - results4.length),
    ]);
    mergedResults.push(...remainingResults.reduce((acc, curr) => [...acc, ...curr], []));
  }

  // Return page of results
  return mergedResults.slice(skip, skip + limit);
};

// eslint-disable-next-line default-param-last
const findByKeyWordAndPostType = async (keyword, postType, sortBy = '-score', page = 1, limit, user) => {
  const query = {
    $or: [
      { title: { $regex: keyword, $options: 'i' } },
      { category: { $regex: keyword, $options: 'i' } },
      { subCategory: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { brand: { $regex: keyword, $options: 'i' } },
      { region: { $regex: keyword, $options: 'i' } },
      { city: { $regex: keyword, $options: 'i' } },
      { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
    ],
  };
  const response = {
    limit: 0,
    page,
    totalPages: 0,
    totalResults: 0,
    results: [],
  };
  switch (postType) {
    case 'Deal':
      return dealService.queryDeals(query, { sortBy, page: parseInt(page, 10), limit });
    case 'Free':
      return freeService.queryFrees(query, { sortBy, page: parseInt(page, 10), limit });
    case 'Discussion':
      return discussionService.queryDiscussions(query, { sortBy, page: parseInt(page, 10), limit });
    case 'PromoCode':
      return promocodeService.queryPromoCodes(query, { sortBy, page: parseInt(page, 10), limit }, user);
    default:
      const deals = await dealService.queryDeals(query, { sortBy, page: parseInt(page, 10), limit });
      const frees = await freeService.queryFrees(query, { sortBy, page: parseInt(page, 10), limit });
      const discussions = await discussionService.queryDiscussions(query, { sortBy, page: parseInt(page, 10), limit });
      const promocodes = await promocodeService.queryPromoCodes(query, { sortBy, page: parseInt(page, 10), limit }, user);
      response.results = mergeAndSort([...deals.results, ...frees.results, ...discussions.results, ...promocodes.results]);
      response.totalPages = Math.max(...[deals, frees, discussions, promocodes].map((obj) => obj.totalPages));
      response.limit = Math.max(...[deals, frees, discussions, promocodes].map((obj) => obj.limit));
      return response;
  }
};

module.exports.findByKeyWordAndPostType = findByKeyWordAndPostType;
module.exports.findByKeyWord = findByKeyWord;
