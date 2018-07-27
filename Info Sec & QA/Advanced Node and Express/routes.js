// lesson 13
// copy routes from server file into this file
// add proper dependencies

const passport = require('passport');
const bcrypt = require('bcrypt');


module.exports = function (app, db) {
  // lesson 2 essentially
  // res.render(process.cwd() + '/views/pug/index.pug', {title:'Hello',message:'Please login'});
  app.route('/')
    .get((req, res) => {
    // lesson 2
      res.render(process.cwd() + '/views/pug/index.pug', {title:'Hello',
                                                          message:'Please login',
                                                          showLogin: true,
                                                          showRegistration:true});
    });
  // Lesson 7 - add a post route for /login and add proper passport parameters
  // there are 2 ways to write this
  /*app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),(req,res) => {
       res.redirect('/');
  });*/
  // using app.route below is a more modular approach to routing in general
  app.route('/login')
      .post(passport.authenticate('local', { failureRedirect: '/' }),(req,res) => {
         res.redirect('/profile');
    });
    /*app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),(req,res) => {
         res.redirect('/');
    });*/
    
    // lesson 8, on a route get route to profile,
    // pass custom middle ware after the mongo call
    // to the get so folks can't just willy nilly
    // go into profile page without authentication
    
    // also lesson 9, we can use the username name on the html
    // see the parameters passed into the render method for the pug
  app.route('/profile')
    .get(ensureAuthenticated, (req,res) => {
       res.render(process.cwd() + '/views/pug/profile',{username:req.user.username});
  });

  // Lesson 10, logout, add logout route, passport does the work
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
  });

  // lesson 11 - adding register route
  app.route('/register')
    .post((req, res, next) => {
      db.collection('users').findOne({ username: req.body.username }, function (err, user) {
        if(err) {
            next(err);
        } else if (user) {
            res.redirect('/');
        } else {
            // PASSWORD IS IN MEMORY
            // Lesson 12 - hash password with bcrypt
            // so u don't store plain text passwords
            // this still isn't secure tho
            var hash = bcrypt.hash(req.body.password, 12);
            db.collection('users').insertOne(
              {username: req.body.username,
               password: hash},
              (err, doc) => {
                  if(err) {
                      res.redirect('/');
                  } else {

                      next(null, user);
                  }
              }
            )
        }
    })},
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
        res.redirect('/profile');
    }
  );

  // lesson 10 add 404 handling after all routes
  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}
// Lesson 8 - prevent someone from just going to the profile.pug page
// by creating custom middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/');
};