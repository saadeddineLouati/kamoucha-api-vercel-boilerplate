const { getFieldLabel } = require('../utils/vanilla');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    const path = helpers?.state?.path.join('.');
    const key = path?.split('.').pop();
    return helpers.message(`${getFieldLabel(key || `${value}`)} invalide`);
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message(`Mot de passe doit être d'au moins 8 caractères`);
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(`Le mot de passe doit contenir au moins 1 lettre et 1 chiffre`);
  }
  return value;
};

module.exports = {
  objectId,
  password,
};
