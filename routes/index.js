var mongoose = require('mongoose');
var express = require('express');
require('../models/ChallengeUserLogin');

var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');    

var router = express.Router();

module.exports = function(app, app_configuration){
    var express = require('express');
    var router = express.Router();
    var user_controllers = require('./user_controllers')(app_configuration.userLoginType)
    var score_controllers = require('./score_controllers')(app_configuration.scoreType)

    router.post('/user', user_controllers.addUser);
    router.post('/score', score_controllers.addScore);
    router.get('/test',function(req,res,next){
	query = ChallengeUserLogin.find().distinct('displayName', function(err,data){
	    ChallengeUserLogin.find().in('displayName',data).sort('displayName').limit(data.length).exec(function(err,data){
		res.json({result:true});
		return true		
	    })	    
	})
    });
    return router;
}
