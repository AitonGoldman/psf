var auth = function(req, res, next){
    if (!req.isAuthenticated()){
	res.send(401);
    } else {
	next()
    }
}

var checkLoggedIn = function(req){
    if(req.isAuthenticated()){
	return true;
    } else {
	return false;
    }
}

module.exports = function(login_type, passport){
    controllers = {};
    var mongoose = require('mongoose');
    require('../models/ChallengeUserLogin');
    var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');
    if(login_type == 'local'){
	var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');
	controllers = {
	    checkLoggedIn: function(req,res,next){
		if(checkLoggedIn(req)){
		    res.json({results:true})
		} else {
		    res.json({results:false})		    
		}
	    },
	    login: function(req,res,next){
		passport.authenticate('local-login', function(err, user, info) {
		    if (err) {
			// if error happens
			console.log('generic error in login')
			return next(err);
		    }
		    
		    if (!user) {
			// if authentication fail, get the error message that we set
			// from previous (info.message) step, assign it into to
			// req.session and redirect to the login page again to display
			console.log('auth failure in login')
			//req.session.messages = info.message;
			return res.status(401).json({});
		    }
		    
		    // if everything's OK
		    req.logIn(user, function(err) {
			if (err) {
			    //req.session.messages = "Error";
			    return next(err);
			    console.log('passport auth failure in login')
			}
			
			// set the message
			//req.session.messages = "Login successfully";
			//return res.redirect('/');
			return res.json({result:user._id,
					err:undefined});		    
		    });	
		})(req, res, next);
	    }
	}
	return controllers;
    }
}
