module.exports.createLocalDateFromString = (dateString) => {
  const date = new Date(dateString);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  return date;
};

module.exports.getDateString = (date) => {
  let dd = date.getDate();
  let mm = date.getMonth() + 1; //January is 0
  const yyyy = date.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return yyyy + '-' + mm + '-' + dd;
};

module.exports.getDiffInDays = (firstDate, secondDate) => {
  const daysInMillisecond = 24 * 60 * 60 * 1000;
  return Math.ceil(Math.abs(firstDate - secondDate) / daysInMillisecond);
};
