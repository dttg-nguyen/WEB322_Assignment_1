// require('dotenv').config();
const nodemailer = require('nodemailer');

//nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.transporterUser,
    pass: process.env.transporterPass,
  },
});

//send email to new sign-up user
const sendEmail = (data) => {
  let emailOptions = {
    from: process.env.transporterUser,
    to: data.sendTo,
    subject: data.subject,
    html: data.html,
  };

  transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
      console.log('ERROR: cannot send email ' + error);
    } else {
      console.log('SUCCESS: ' + info, response);
    }
  });
};

module.exports.sendEmail = sendEmail;
