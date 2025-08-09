function dateWithoutTime(date = new Date()) {
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = {
  dateWithoutTime,
};
