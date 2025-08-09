const VENDOR_PROMOCODE_PERCENT = 'vendor_promocode_percent';

const alertTypes = {
  SEARCH_ALERT: 'search_alert',
  VENDOR_ALERT: 'vendor_alert',
};

const boostTypes = {
  SIMPLE_BOOST: 'simple_boost',
  SUPER_BOOST: 'super_boost',
};

const notificationStatus = {
  IS_SENT: 'is_sent',
  IS_SEEN: 'is_seen',
};

const notificationTypes = {
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
  LIKE_NOTIFICATION: 'LIKE_NOTIFICATION',
  DISLIKE_NOTIFICATION: 'DISLIKE_NOTIFICATION',
  COMMENT_NOTIFICATION: 'COMMENT_NOTIFICATION',
  DEAL_NOTIFICATION: 'DEAL_NOTIFICATION',
  FREE_NOTIFICATION: 'FREE_NOTIFICATION',
  PROMOCODE_NOTIFICATION: 'PROMOCODE_NOTIFICATION',
  DISCUSSION_NOTIFICATION: 'DISCUSSION_NOTIFICATION',
  CATALOGUE_NOTIFICATION: 'CATALOGUE_NOTIFICATION',
};

const visitTypes = {
  PRODUCT_VISIT: 'product_visit',
  VENDOR_VISIT: 'vendor_visit',
  DEAL_VISIT: 'deal_visit',
  PROMOCODE_VISIT: 'promocode_visit',
  FREE_VISIT: 'free_visit',
  DISCUSSION_VISIT: 'DISCUSSION_VISIT',
};

const contentTypes = {
  INDEX_SLIDER_1: 'index_slider_1',
  INDEX_SLIDER_2: 'index_slider_2',
  INDEX_SLIDER_3: 'index_slider_3',
  INDEX_SLIDER_4: 'index_slider_4',
  CATEGORY_ORDER_1: 'category_order_1',
  CATEGORY_ORDER_2: 'category_order_2',
  CATEGORY_ORDER_3: 'category_order_3',
  CATEGORY_ORDER_4: 'category_order_4',
  BRANDS: 'brands',
  ADS: 'ads',
  TOPBAR: 'topbar',
  PREVIOUS_WINNERS: 'previous_winners',
};

const likeTypes = {
  LIKE: 'LIKE',
  DISLIKE: 'DISLIKE',
};

const dealTypes = {};

const filterKeysToPick = [
  'title',
  'link',
  'category',
  'subCategory',
  'startDate',
  'endDate',
  'images',
  'image',
  'noExpiration',
  'description',
  'region',
  'city',
  'stock',
  'tags',
  'max-price',
  'min-price',
  'max-sale_price',
  'min-sale_price',
  'withShipping',
  'atStore',
  'deliveryFees',
  'freeDelivery',
  'make',
  'mileage',
  'color',
  'state',
  'gearBox',
  'year',
  'cylinders',
  'fiscalPower',
  'bodyType',
  'fuel',
  'gender',
  'size',
  'choesSize',
  'height',
  'length',
  'width',
  'seats',
  'rooms',
  'wc',
  'kitchens',
  'reference',
  'isbn',
  'duration',
  'levels',
  'level',
  'safeGuard',
  'fees',
  'furniture',
  'hasElevator',
  'activityArea',
  'agreementType',
  'function',
  'experience',
  'studyLevel',
  'processor',
  'storage',
  'ram',
  'screenSize',
  'hasextEnsibleMemory',
  'theme',
  'editor',
  'language',
  'author',
  'clothesSize',
  'closthesState',
  'numberofpages',
  'isforadults',
  'user',
  'hideExpired',
  'isCommented',
  'min-mileage',
  'max-mileage',
  'min-year',
  'max-year',
  'min-fiscalPower',
  'max-fiscalPower',
  'min-surface',
  'max-surface',
  'min-wc',
  'max-wc',
  'min-rooms',
  'max-rooms',
  'min-kitchens',
  'max-kitchens',
  'status',
  'isCommented',
  'hideExpired',
  'brand',
];

const postStatus = {
  published: '0',
  unpublished: '1',
  expired: '2',
  banned: '3',
  deleted: '4',
};

const getAlertTypes = () => {
  return Object.keys(alertTypes).map((key) => alertTypes[key]);
};

const getLikeTypes = () => {
  return Object.keys(likeTypes).map((key) => likeTypes[key]);
};

const getBoostTypes = () => {
  return Object.keys(boostTypes).map((key) => boostTypes[key]);
};

const getNotificationStatus = () => {
  return Object.keys(notificationStatus).map((key) => notificationStatus[key]);
};

const getNotificationTypes = () => {
  return Object.keys(notificationTypes).map((key) => notificationTypes[key]);
};

const getVisitTypes = () => {
  return Object.keys(visitTypes).map((key) => visitTypes[key]);
};

const getContentTypes = () => {
  return Object.keys(contentTypes).map((key) => contentTypes[key]);
};

const getDealTypes = () => {
  return Object.keys(dealTypes).map((key) => dealTypes[key]);
};

module.exports = {
  getAlertTypes,
  alertTypes,
  getBoostTypes,
  boostTypes,
  getNotificationStatus,
  notificationStatus,
  getNotificationTypes,
  notificationTypes,
  getVisitTypes,
  visitTypes,
  getContentTypes,
  contentTypes,
  VENDOR_PROMOCODE_PERCENT,
  dealTypes,
  getDealTypes,
  likeTypes,
  getLikeTypes,
  filterKeysToPick,
  postStatus,
};
