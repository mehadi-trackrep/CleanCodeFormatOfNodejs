var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');
var bcrypt = require('bcrypt-nodejs');

// Expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
          User.findOne({ 'email' :  email }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                  return done(err);
              if (user) {
                  return done(null, false, req.flash('error', 'That email is already taken.'));
              } else {
                  // if there is no user with that email create the user
                  var newUser  = new User();
                  newUser.email    = email;
                  newUser.password = User.generateHash(password);
                  newUser.name = req.body.name;
                  newUser.username = req.body.username;
                  // save the user
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser,req.flash('success_msg', 'Account Created Successfully!!'));
                      req.session.destroy();
                  });
              }
          });
        });
    }));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) { // callback with email and password from our form

        User.findOne({ 'email' :  email }, function(err, user) {
            if (err)
              return done(null, false, req.flash('error_msg', err));
            if (!user)
                return done(null, false, req.flash('error_msg', 'Sorry Your Account Not Exits ,Please Create an Account!'));
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('error_msg', 'Password Does Not Match!!'));
            /** If all is well, return successful user **/
            req.session.user = user;
            return done(null, user);
        });
    }));
};
