const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;

// lesson 4 - serial and deserialize, just setting it up, this will go in db calls
/*
  passport.serializeUser((user, done) => {
     done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
          db.collection('users').findOne(
              {_id: new ObjectID(id)},
              (err, doc) => {
                  done(null,null) <- this needs to be removes for lesson 5 to pass
              }
          );
      });
*/

module.exports = function (app, db) {
  // lesson 6 start - add the passport strategy
  passport.use(new LocalStrategy(
      function(username, password, done) {
        db.collection('users').findOne({ username: username }, function (err, user) {
          console.log('User '+ username +' attempted to log in.');
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          // lesson 12 - change password checking logic to use bcrypt hash instead
          // or plaintext password
          // plaintext:
          // if (password !== user.password) { return done(null, false); }
          // NOTE PASSWORD SENT IN PLAINTEXT IN REQ
          // need to investigate end to end encryption
          if (!bcrypt.compare(password, user.password)) { return done(null, false); }
          return done(null, user);
        });
      }
    ));
    // END lesson 6
    // Serialize
    passport.serializeUser((user, done) => {
     done(null, user._id);
    });

    // Deserialize
    passport.deserializeUser((id, done) => {
      db.collection('users').findOne(
        {_id: new ObjectID(id)},
        (err, doc) => {
			      done(null, doc);
          // need a done statement here, if empty nothing will work
          // validated this via using fcc tested, although furhter validaiton may change
          // prior test mentioned to comment out done(null, null) 
          // test still passed with no done statment, but further teting errors in 
          // future tests came back to this point
          // done(null,null) from lesson 4 removed
        }
      );
    });
}