// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mongoose = require('mongoose');
var passportUser = mongoose.model('ChallengeUserLogin');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
	done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
	passportUser.findById(id, function(err, user) {
	    done(err, user);
	});
    });
    
    passport.use('local-login', new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'username',
	passwordField : 'password',
	passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, username, password, done) { // callback with email and password from our form
	
	// find a user whose email is the same as the forms email
	// we are checking to see if the user trying to login already exists
	passportUser.findOne({ 'local.username' :  username.toLowerCase() }, function(err, user) {
	    // if there are any errors, return the error before anything else
	    if (err)
		return done(err);
	    
	    // if no user is found, return the message
	    if (!user)
		return done(null, false); // req.flash is the way to set flashdata using connect-flash
	    
	    // if the user is found but the password is wrong
	    if (!user.validPassword(password))
		return done(null, false); // create the loginMessage and save it to session as flashdata
	    
	    // all is well, return successful user
	    return done(null, user);
	});	
    }));    
};
