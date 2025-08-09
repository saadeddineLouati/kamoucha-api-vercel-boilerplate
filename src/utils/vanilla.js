const filedLabels = {
  referralCode: 'Code de parrainage',
};

const mergeAndSort = (json) => {
  const merged = [].concat(...Object.values(json));
  return merged.sort((a, b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });
};

const getFieldLabel = (field) => {
  const cleanedField = field.replace(/"/g, '');
  return filedLabels[cleanedField] || field;
};

function formatDateToString(date) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-GB', options);
}

module.exports = {
  mergeAndSort,
  getFieldLabel,
  formatDateToString,
};
