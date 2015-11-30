var mongoose = require('mongoose');
var express = require('express');
require('../models/ChallengeUserLogin');

var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');    
var ChallengeScore = mongoose.model('ChallengeScore');    

var ObjectId = require('mongoose').Types.ObjectId; 

var router = express.Router();

module.exports = function(app, app_configuration){
    var express = require('express');
    var router = express.Router();
    var user_controllers = require('./user_controllers')(app_configuration.userLoginType)
    var score_controllers = require('./score_controllers')(app_configuration.scoreType)

    router.post('/user', user_controllers.addUser);
    router.put('/user/:userid/email', user_controllers.updateUserEmail);
    router.put('/user/:userid/displayname', user_controllers.updateUserDisplayName);
    router.post('/score', score_controllers.addScore);
    router.get('/user/:userid', user_controllers.getUserInfo);
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
