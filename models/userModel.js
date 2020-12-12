// require mongoose and setup the Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require('bluebird');

// define the photo schema
const userSchema = new Schema({
  // userName: String,
  firstName: String,
  lastName: String,
  phone: Number,
  email: {
    type: String,
    unique: true
  },
  password: String,
  dob: Date,
  bookings:[
    {
      roomId: String,
      roomTitle: String,
      roomPhoto: String,
      location: String,
      checkinDate: Date,
      checkoutDate: Date,
      checkinDateStr: String,
      checkoutDateStr: String,
      numberOfNights: Number,
      totalPrice: Number,
    }
  ],
  isAdmin: false,
});

module.exports = mongoose.model('Users', userSchema);
