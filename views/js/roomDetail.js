import * as formUtils from './formUtils.js';
import * as datePickerUtils from './datePickerUtils.js';

window.main = () => {
  window.formValidCheck = formUtils.formValidCheck;

  datePickerUtils.setInitialDateInputs('checkIn', 'checkOut');
  datePickerUtils.adjustCheckOutWhenCheckInChange('checkIn', 'checkOut');
}
