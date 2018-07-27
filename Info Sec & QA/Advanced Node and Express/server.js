// Security enlightenment
// Password is stored in plaintext in memory on the server this method

'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
// lesson 1 require pug
const pug = require('pug');
// lesson 3 require express-session and passport
// ALSO SEE ENV FILE 
const session = require('express-session');
const passport = require('passport');
// lesson 4 - To make a query search for a Mongo _id you will have
// to create 
// const ObjectID = require('mongodb').ObjectID;
const ObjectID = require('mongodb').ObjectID;
// lesson 5 - see lesson 4 for history - in lessons 5, we wrap the serialization
// process in a mongo.connect call so to make a sinlge constant connection
// to the database during the life of the app
// start it by requiring MongoClient from MongoDB
const mongo = require('mongodb').MongoClient;
// Lesson 6 - add a passport strategy ot be used -
// A strategy is a way of authenticating a user. 
const LocalStrategy = require('passport-local');
// Lesson 12 - add bcrypt.js for password hashing
const bcrypt = require('bcrypt');
// lesson 13 - fix up code into seperate js files
// Routes.js and Auth.ks (local)
// and then require them
const routes = require('./routes.js');
const auth = require('./auth.js');
const app = express();

fccTesting(app); //For FCC testing purposes
app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// lesson 3 add app.use with other parts of lesson 3
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// also lesson 3
app.use(passport.initialize());
app.use(passport.session());

// lesson 5 put serialization within the mongo.connect call
// note for me, typical callback shenanigans
// another note, basically everything needs to be in 
// the db call to ensure persistent connection
mongo.connect(process.env.DATABASE, (err,db) => {
  if (err) {console.log('Database error: ' + err)}
  else {
    console.log('Successful database connection')
    auth(app,db)
    routes(app, db)
  }
  // Lesson 5, needed to move the app.listen call into the mongo connect call
  // this is part of setting up the constant connection
  app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port " + process.env.PORT);
  });
})

