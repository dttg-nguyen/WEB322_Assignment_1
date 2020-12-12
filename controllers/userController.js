const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { sendEmail } = require('../utils/emailUtils');

//log in
exports.loginGet = function (req, res) {
  res.render('logIn', { layout: false });
};

exports.loginPost = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    return res.render('logIn', {
      errMsg: 'You must enter both email and password to log in.',
      layout: false,
    });
  } else {
    userModel
      .findOne({ email: email })
      .exec()
      .then((data) => {
        if (!data) {
          console.log('user not found');
          return res.render('logIn', {
            errMsg: 'Email is not signed up yet. Please sign up first.',
            layout: false,
          });
        } else {
          bcrypt.compare(password, data.password).then((result) => {
            if (!result) {
              return res.render('logIn', {
                errMsg: 'Password entered is incorrect!',
                layout: false,
              });
            } else {
              req.session.user = {
                id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                isAdmin: data.isAdmin,
                signUp: false,
              };
              res.redirect('/user/dashboard');
            }
          });
        }
      });
  }
};

//dashboard
exports.dashboardGet = function (req, res) {
  let user = req.session.user;
  userModel
    .findOne({ email: user.email })
    .lean()
    .exec()
    .then((data) => {
      return res.render('dashboard', { user: data, layout: false });
    });
};

//sign up
exports.signUpGet = function (req, res) {
  res.render('signUp', { layout: false });
};

exports.signUpPost = function (req, res) {
  const FORM_DATA = req.body;

  //server side validation
  let valid = false;
  const phoneReg = /\d{3}[ -]?\d{3}[ -]?\d{4}/;
  const emailReg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
  const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;

  if (
    FORM_DATA.signUpFirstName === '' ||
    FORM_DATA.signUpLastName === '' ||
    FORM_DATA.signUpPhone === '' ||
    FORM_DATA.signUpEmail === '' ||
    FORM_DATA.signUpPassword === '' ||
    FORM_DATA.signUpBirthday === ''
  ) {
    valid = false;
    return res.render('signUp', {
      errMsg: 'Please fill out all information to sign up.',
      data: FORM_DATA,
      layout: false,
    });
  } else {
    if (phoneReg.test(FORM_DATA.signUpPhone)) {
      valid = true;
    } else {
      valid = false;
      return res.render('signUp', {
        invalidPhone: 'Please enter a valid Canadian phone number',
        data: FORM_DATA,
        layout: false,
      });
    }

    if (emailReg.test(FORM_DATA.signUpEmail)) {
      valid = true;
    } else {
      valid = false;
      return res.render('signUp', {
        invalidEmail: 'Please enter a valid email address.',
        data: FORM_DATA,
        layout: false,
      });
    }

    if (passwordReg.test(FORM_DATA.signUpPassword)) {
      valid = true;
    } else {
      valid = false;
      return res.render('signUp', {
        invalidPassword:
          'Password must be between 8 and 12 characters, and contain at least one letter, one number and one special character',
        data: FORM_DATA,
        layout: false,
      });
    }
  }

  if (valid) {
    userModel
      .findOne({ email: FORM_DATA.signUpEmail })
      .exec()
      .then((data) => {
        if (!data) {
          bcrypt
            .hash(FORM_DATA.signUpPassword, 10)
            .then((hashedPassword) => {
              const user = new userModel({
                firstName: FORM_DATA.signUpFirstName,
                lastName: FORM_DATA.signUpLastName,
                phone: FORM_DATA.signUpPhone,
                email: FORM_DATA.signUpEmail,
                password: hashedPassword,
                dob: FORM_DATA.signUpBirthday,
              });

              user.save((err) => {
                if (err) {
                  console.log('There was an error saving to database.');
                } else {
                  req.session.user = {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                  };

                  const data = {
                    sendTo: FORM_DATA.signUpEmail,
                    subject: 'AirM&M - Welcome to our community',
                    html:
                      '<p> Hello <strong>' +
                      FORM_DATA.signUpFirstName +
                      ' ' +
                      FORM_DATA.signUpLastName +
                      "</strong>,</p><p>Thank you for signing up. We are happy that you are here.<br>You have been added to our mailing list and will now be among the first to hear about new promotions and special offers.</p><p>Let's start the journey together.</p><p>AirM&M's Team</p>",
                  };

                  //send confirm email
                  sendEmail(data);

                  res.redirect('/user/dashboard');
                }
              });
            })
            .catch((err) => {
              console.log(`Cannot hash password for user ${FORM_DATA.email}, error: ${err}`);
            });
        } else {
          valid = false;
          return res.render('signUp', {
            errMsg:
              'Email already exists. Please log in or use another email to sign up.',
            data: FORM_DATA,
            layout: false,
          });
        }
      });
  }
};

//log out - reset session
exports.logout = function (req, res) {
  req.session.reset();
  res.redirect('/');
};
