const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const db = require('mongoose');
require('dotenv').config();
const clientSessions = require('client-sessions');

const homeRouter = require('./routes/home');
const roomRouter = require('./routes/room');
const userRouter = require('./routes/user');

const HTTP_PORT = process.env.PORT || 8080;
const app = express();

/*----------------------------------------------------------------------- */
//let server know how to handle .hbs files
app.engine('.hbs', exphbs({ extname: '.hbs', helpers: require('./handlebars-helpers') }));
app.set('view engine', '.hbs');

//make express look into the directory for assets (css/js/img)
app.use(express.static('views'));
app.use(express.static('public'));

/*------------------------database connection---------------------------*/
db.connect(process.env.dbconn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//test
db.connection.on('open', () => {
  console.log('Database connection open.');
});

/*------------------------setup client session---------------------------*/
app.use(
  clientSessions({
    cookieName: 'session',
    secret: process.env.sessionSecret,
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
  })
);

//body parsers for registration form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*---------------------------routing-------------------------------------- */
app.use('/', homeRouter);
app.use('/rooms', roomRouter);
app.use('/user', userRouter);

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
