const clean = (object) => {
  Object.keys(object).forEach((key) => {
    const keyParts = key.split('-');
    if (keyParts.length === 2) {
      if (keyParts[0] === 'max') {
        if (object[keyParts[1]]) {
          object[keyParts[1]] = { ...object[keyParts[1]], $lte: parseInt(object[key], 10) };
        } else {
          object[keyParts[1]] = { $lte: parseInt(object[key], 10) };
        }
      } else if (object[keyParts[1]]) {
        object[keyParts[1]] = { ...object[keyParts[1]], $gte: parseInt(object[key], 10) };
      } else {
        object[keyParts[1]] = { $gte: parseInt(object[key], 10) };
      }
      delete object[key];
    }
  });
  Object.keys(object).forEach((key) => {
    if (
      [
        'status',
        'types',
        'color',
        'make',
        'state',
        'gearBox',
        'desiredsubcategories',
        'desiredcategories',
        'towns',
        'tags',
        'activityarea',
        'kitchens',
        'wc',
        'rooms',
        'seats',
        'gender',
        'bodyType',
        'cylinders',
        'gearBox',
        'closthesState',
        'clothesSize',
        'path',
        'type',
      ].includes(key)
    ) {
      object[key] = { $in: String(object[key]).split(',') };
    }
    if (key === 'hideExpired') {
      object.endDate = { $gte: new Date() };
      delete object.hideExpired;
    }
    if (key === 'isCommented') {
      object.totalComments = { $gte: 1 };
      delete object.isCommented;
    }
    if (key === 'start') {
      object.createdAt = { $gte: 1 };
    }
    if (key === 'end') {
      object.createdAt = { $lte: 1 };
    }
  });

  return object;
};

module.exports = clean;
