const fs = require('fs');
const RoomModel = require('../models/roomModel');
const UserModel = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');
const timeUtils = require('../utils/timeUtils');
const PHOTODIRECTORY = './public/photos/';

exports.listRooms = function(req, res) {
  RoomModel.find()
    .lean()
    .exec()
    .then((rooms) => {
      res.render('roomListing', {
        rooms: rooms,
        hasRooms: !!rooms.length,
        user: req.session.user,
        layout: false,
      });
    });
};

exports.getRoom = function(req, res) {
  const roomId = req.params.roomId;
  const saved = req.query.saved;

  RoomModel.findOne({ _id: roomId })
    .lean()
    .exec()
    .then((room) => {
      let roomDetailData = {
        room: {
          ...room,
          multiBedrooms: room.bedroom > 1,
          multiBathrooms: room.bathroom > 1,
        },
        layout: false,
      };

      const user = req.session.user;

      if (user) {
        UserModel.findOne({ _id: user.id})
        .exec()
        .then((dbUser) => {
          let canReview = false;
          // if (hasPastBooking(dbUser, roomId) && !hasReviewed(user.id, room)) {
          //   canReview = true;
          // }
          if (hasPastBooking(dbUser, roomId)) {
            canReview = true;
          }
          roomDetailData = {
            ...roomDetailData,
            user: user,
            saved: saved,
            canReview: canReview
          };
         res.render('roomDetail', roomDetailData);
        });
      } else {
        // non-user
       res.render('roomDetail', roomDetailData);
      }
    })
    .catch((reason) => {
      console.log(`Cannot get room with id ${roomId}, reason: ${reason}`);
    });
};

exports.displayCreateRoomPage = function(req, res) {
  res.render('editRoom', { user: req.session.user, layout: false });
};

exports.displayRoomEditPage = function(req, res) {
  const roomId = req.params.roomId;

  RoomModel.findOne({ _id: roomId })
    .lean()
    .exec()
    .then((room) => {
      const user = req.session.user;
      res.render('editRoom', {
        room: room,
        user: user,
        layout: false,
      });
    });
};

exports.saveRoom = function(req, res) {
  const room = {
    ...req.body,
    photoName: req.file ? req.file.filename : req.body.originalPhoto,
  };

  if (room.id) {
    // edit room
    const updateQuery = {
      hostName: room.hostName,
      title: room.title,
      price: room.price,
      roomType: room.roomType,
      desc: room.desc,
      bedroom: room.bedroom,
      bathroom: room.bathroom,
      location: room.location,
    };

    // only update photoName if edited room has a new photo
    if (room.photoName !== room.originalPhoto) {
      //delete old photo from storage
      removePhoto(PHOTODIRECTORY, room.originalPhoto);
      //add photName to updatequery
      updateQuery.photoName = room.photoName;
    }

    RoomModel.updateOne(
      { _id: room.id },
      {
        $set: updateQuery,
      }
    )
      .exec()
      .then(() => {
        // saved equals true when the room has just been saved, display a success message
        res.render('roomDetail', {
          room: room,
          user: req.session.user,
          saved: true,
          layout: false,
        });
      })
      .catch((reason) => {
        console.log(`Cannot update room with id ${room.id}, reason: ${reason}`);
      });
  } else {
    // create new room
    const newRoom = new RoomModel({
      hostName: room.hostName,
      title: room.title,
      price: room.price,
      roomType: room.roomType,
      desc: room.desc,
      bedroom: room.bedroom,
      bathroom: room.bathroom,
      location: room.location,
      photoName: room.photoName,
    });

    newRoom.save((err, createdRoom) => {
      if (err) {
        console.log(`Cannot save room ${createdRoom}`);
        res.render('editRoom', {user: req.session.user, errMsg:'Please fill in all the fields to create a new room.', layout:false});
      } else {
        res.redirect(`/rooms/${createdRoom._id}?saved=true`);
      }
    });
  }
};

exports.deleteRoom = function(req, res) {
  const roomId = req.params.roomId;

  RoomModel.deleteOne({ _id: roomId })
    .then(() => {
      removePhoto(PHOTODIRECTORY, req.body.photoName);
      res.redirect('/rooms');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.bookRoom = function(req, res) {
  const checkinDate = timeUtils.createLocalDateFromString(req.body.checkinDate);
  const checkoutDate = timeUtils.createLocalDateFromString(req.body.checkoutDate);

  const checkinDateStr = timeUtils.getDateString(checkinDate);
  const checkoutDateStr = timeUtils.getDateString(checkoutDate);

  const numberOfNights = timeUtils.getDiffInDays(checkinDate, checkoutDate);

  const roomId = req.params.roomId;
  const user = req.session.user;

  RoomModel.findOne({ _id: roomId })
    .lean()
    .exec()
    .then((room) => {
      const totalPrice = room.price * numberOfNights;

      const booking = {
        roomId: room._id,
        roomTitle: room.title,
        roomPhoto: room.photoName,
        location: room.location,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        checkinDateStr: checkinDateStr,
        checkoutDateStr: checkoutDateStr,
        numberOfNights: numberOfNights,
        totalPrice: totalPrice,
      };

      const emailData = {
        sendTo: user.email,
        subject: 'AirM&M - Thank you for booking with us',
        html:
          '<p> Hello <strong>' +
          user.firstName +
          ' ' +
          user.lastName +
          '</strong>,</p><br><p>You have just booked a great place for your next trip.<br>Please find below your booking details and payment information.<p>Room: ' +
          booking.roomTitle +
          '</p><p>Location: ' +
          booking.location +
          '</p><p>Check-in date: ' +
          booking.checkinDateStr +
          '</p><p>Check-out date:  ' +
          booking.checkoutDateStr +
          '</p><p>Total price: $' +
          booking.totalPrice +
          ' for ' +
          booking.numberOfNights +
          " night(s)</p><p>We wish you a pleasant stay.</p><br><p>Thank you,</p><p>AirM&M's Team</p>",
      };
      sendEmail(emailData);

      UserModel.updateOne(
        { email: user.email },
        {
          $push: { bookings: booking },
        },
        function(error) {
          if (error) {
            console.log(`Failed to save ${booking}, error: ${error}`);
          }
        }
      );

      res.render('bookingConfirmation', {
        user: user,
        room: room,
        booking: booking,
        layout: false,
      });
    });
};

exports.searchRoomsByLocation = function(req, res) {
  const location = req.body.location;

  RoomModel.find({
    location: location,
  })
    .lean()
    .exec()
    .then((rooms) => {
      res.render('roomListing', {
        rooms: rooms,
        hasRooms: !!rooms.length,
        user: req.session.user,
        layout: false,
      });
    });
};

exports.createReview = function(req, res) {
  const roomId = req.params.roomId;
  const {
    userId,
    userFirstName,
    userLastName,
    message
  } = req.body;

  if (message) {
    const now = new Date();
    const review = {
      userId,
      userFirstName,
      userLastName,
      message,
      reviewDate: now,
      reviewDateStr: timeUtils.getDateString(now)
    }

    RoomModel.updateOne(
      { _id: roomId },
      {
        $push: { reviews: review }
      },
      function(error) {
        if (error) {
          console.log(`Failed to save ${review}, error: ${error}`);
        }
      });
  }

  res.redirect(`/rooms/${roomId}#reviewSection`);
}

//remove photo from storage
const removePhoto = (photoDirectory, photoName) => {
  fs.unlink(photoDirectory + photoName, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Remove photo: ' + photoName);
  });
};

const hasPastBooking = (user, roomId) => {
  return user.bookings.some((booking) => {
    return booking.roomId === roomId && booking.checkoutDate <= new Date();
  });
};

// const hasReviewed = (userId, room) => {
//   return room.reviews.some((review) => {
//     return review.userId === userId;
//   });
// };
