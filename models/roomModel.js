// require mongoose and setup the Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
mongoose.Promise = require('bluebird');

// define the photo schema
const roomSchema = new Schema({
  hostName: String,
  title: String,
  price: Number,
  roomType: String,
  desc: String,
  bedroom: Number,
  bathroom: Number,
  location: String,
  photoName: {
    type: String,
    unique: true,
  },
  reviews: [
    {
      userId: String,
      userFirstName: String,
      userLastName: String,
      message: String,
      reviewDate: Date,
      reviewDateStr: String
    }
  ]
});

module.exports = mongoose.model('Rooms', roomSchema);
