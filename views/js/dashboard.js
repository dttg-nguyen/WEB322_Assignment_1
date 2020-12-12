import * as formUtils from './formUtils.js';
import * as datePickerUtils from './datePickerUtils.js';

window.main = () => {
  window.formValidCheck = formUtils.formValidCheck;
  window.resetForm = formUtils.resetForm;

  datePickerUtils.setInitialDateInputs('checkIn', 'checkOut');
  datePickerUtils.adjustCheckOutWhenCheckInChange('checkIn', 'checkOut');
}
