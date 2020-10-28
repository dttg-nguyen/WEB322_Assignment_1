var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
// var path = require("path");
var nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");

var app = express();
/*----------------------------------------------------------------------- */
//let server know how to handle .hbs files
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

//body parsers for registration form
app.use(bodyParser.urlencoded({ extended: true }));

//nodemailer transporter
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dttgnguyen.web322@gmail.com",
    pass: "W3bg1ang"
  }
});

//make express look into the public directory for assets (css/js/img)
app.use(express.static("public"));

/*--------------------------------------------------------------------------- */
// setup 'route'
app.get("/", function(req, res){
  res.render("index", { layout: false });
});

app.post("/", function(req, res){
  res.render("index", { layout: false });
});

app.get("/BnB", function(req, res){
  res.render("detailBnB", { layout: false });
});

app.post("/rooms", function(req, res){
  res.render("roomListing", { layout: false });
});

app.post("/payment", function(req, res){
  res.render("paymentConfirm", { layout: false });
});

//process registration: redirect new user to dashboard, send welcome email to the new user
app.post("/dashboard", function(req, res){
  const FORM_DATA = req.body;

  res.render("dashboard", { data: FORM_DATA, layout: false });

  var emailOptions = {
    from: "dttgnguyen.web322@gmail.com",
    to: FORM_DATA.signUpEmail,
    subject: "AirM&M - Welcome to our community",
    html:
      "<p> Hello <strong>" +
      FORM_DATA.signUpFirstName +
      " " +
      FORM_DATA.signUpLastName +
      "</strong>,</p><p>Thank you for signing up. We are happy that you are here.<br>You have been added to our mailing list and will now be among the first to hear about new promotions and special offers.</p><p>Let's start the journey together.</p><p>AirM&M's Team</p>",
  };

  transporter.sendMail(emailOptions, (error, info) => {
      if(error){
          console.log("ERROR: " + error);
      } else{
          console.log("SUCCESS: " + info,response);
      }
  });
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
