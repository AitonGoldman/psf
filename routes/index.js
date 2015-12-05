var mongoose = require('mongoose');
var express = require('express');
require('../models/ChallengeUserLogin');
require('../models/ChallengeScore');

var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');    
var ChallengeScore = mongoose.model('ChallengeScore');    

var ObjectId = require('mongoose').Types.ObjectId; 

var router = express.Router();

// route middleware to make sure a user is logged in
function auth(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
	return next();
    // if they aren't redirect them to the home page
    res.status(401).send({result: false,
			  error: "Authentication Failure"
			 })
    return false
}




module.exports = function(app, passport, app_configuration){
    var express = require('express');
    var router = express.Router();
    var user_controllers = require('./user_controllers')(app_configuration.userLoginType)
    var score_controllers = require('./score_controllers')(app_configuration.scoreType)
    var login_controllers = require('./login_auth_controllers')(app_configuration.userLoginType, passport)
    router.post('/login', login_controllers.login);
    router.get('/login', login_controllers.checkLoggedIn);
    router.post('/user', user_controllers.addUser);
    router.put('/user/:userid/email', user_controllers.updateUserEmail);
    router.put('/user/:userid/displayname', user_controllers.updateUserDisplayName);
    router.post('/score', score_controllers.addScore);
    router.get('/score/:userid/:userid2', score_controllers.getScoreForTwoPlayers);
    router.get('/score/:userid', score_controllers.getScore);
    router.get('/scores/:userid', score_controllers.getScores);
    router.get('/user/:userid', auth, user_controllers.getUserInfo);
    router.get('/user/', auth, user_controllers.getUserInfo);
    router.get('/test/:userid',function(req,res,next){
	//console.log(req.params.userid)
	query = ChallengeScore.find().where('scorePlayers.playerId').in(new ObjectId(req.params.userid)).sort('-dateOfScore').limit(1).exec(function(err,data){
	    // ChallengeUserLogin.find().in('displayName',data).sort('displayName').limit(data.length).exec(function(err,data){
	     	res.json({result:data});
	     	return true		
	    // })	    
	})
    });
    return router;
}
