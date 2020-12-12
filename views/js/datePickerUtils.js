export const setInitialDateInputs = (checkInPickerId, checkOutPickerId) => {
  const today = new Date();
  const todayString = getDateString(today);
  const tomorrowString = getDateStringNextDay(today);

  $(`#${checkInPickerId}`).attr('min', todayString);
  $(`#${checkOutPickerId}`).attr('min', tomorrowString);
};

export const adjustCheckOutWhenCheckInChange = (checkInPickerId, checkOutPickerId) => {
  $(`#${checkInPickerId}`).on('change', function() {
    const checkInDateStr = this.value;
    const checkInDate = createLocalDateFromString(checkInDateStr);

    // Set min date for check out picker
    const minCheckOutDateString = getDateStringNextDay(checkInDate);
    $(`#${checkOutPickerId}`).attr('min', minCheckOutDateString);

    // Set value for check out picker to be greater than check in date
    const checkOutDateStr = $(`#${checkOutPickerId}`).val();
    if (checkOutDateStr) {
      const checkOutDate = createLocalDateFromString(checkOutDateStr);
      if (checkOutDate <= checkInDate) {
        $(`#${checkOutPickerId}`).val(getDateStringNextDay(checkInDate));
      }
    }
  });
};

const getDateString = (date) => {
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

const getDateStringNextDay = (date) => {
  const nextDay = new Date(date.getTime());
  nextDay.setDate(date.getDate() + 1);

  return getDateString(nextDay);
};

const createLocalDateFromString = (dateString) => {
  const date = new Date(dateString);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  return date;
};
