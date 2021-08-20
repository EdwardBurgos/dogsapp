const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { router, temperaments } = require('./routes/index.js');
const dogs = require('./routes/dogs.js');
const users = require('./routes/users.js');
const passport = require('passport');


// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./db.js');

// Create the Express application
const server = express();

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Pass the global passport object into the configuration function
require('./extras/passport.js')(passport);

server.name = 'API';


// This will initialize the passport object on every request
server.use(passport.initialize());

// Instead of using body-parser middleware, use the new Express implementation of the same thing
server.use(express.json());
server.use(express.urlencoded({extended: true}));


server.use(cookieParser());
server.use(morgan('dev'));

// Allows our client to make HTTP requests to Express application
// server.use(cors());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', router);
server.use('/dogs', dogs);
server.use('/users', users);

// This handle errors
server.use((err, req, res, next) => {
  return res.status(500).send('Sorry, an error ocurred');
});

module.exports = server;
