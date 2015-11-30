
function outputValidationError(err){
    error_message = "VALIDATION ERROR WHILE PERFORMING USER OPERATION : "
    for(i in err.errors){
	error_message = error_message + ('**'+i+"--"+err.errors[i].name+"--"+err.errors[i].message)
    }
    return error_message
}

function report_general_error(type_of_error,error, res){
    res.status(400).send({result: false,
			  error: type_of_error+' : '+error 
			 })
    return true
}

function report_mongo_error(err, res){
    if(err){
	res.status(400).send({result: false,
			      error: outputValidationError(err)
			     })
	return true
    }
    return false
}

module.exports = function(login_type){
    var mongoose = require('mongoose');
    require('../models/ChallengeUserLogin');
    require('../models/ChallengeScore');
    var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');
    var ChallengeScore = mongoose.model('ChallengeScore');    
    var ObjectId = require('mongoose').Types.ObjectId; 

    controllers = {};
    if(login_type == 'local'){
	controllers = {
	    updateUserEmail: function(req,res,next){		
		new_email = req.body.email;
		if(new_email === undefined){
		    new_email='';
		}
		return ChallengeUserLogin.update({_id:req.params.userid},{'local.email':new_email},{runValidators: true}).exec(function(err){
		    if(report_mongo_error(err, res)){
			return false
		    }
		    res.json({result:true,
			     error:err});
		    return true;
		})
	    },
	    updateUserDisplayName: function(req,res,next){
		new_displayname = req.body.displayName;
		if(new_displayname === undefined){
		    new_displayname='';
		}
		return ChallengeUserLogin.update({_id:req.params.userid},{'displayName':new_displayname}, {runValidators: true}).exec(function(err){
		    if(report_mongo_error(err, res)){
			return false
		    }

		    res.json({result:true,
			     error: err});
		    return true;
		})
	    },
	    getUserInfo: function(req,res,next){
		return ChallengeScore.find().where('scorePlayers.playerId').in(new ObjectId(req.params.userid)).sort('-dateOfScore').limit(1).exec(function(err,latest_score){
		    if(report_mongo_error(err, res)){
			return false
		    }
		    return ChallengeUserLogin.findOne({_id:new ObjectId(req.params.userid)}, function(err,user){
			var latest_score_player_index = -1;
			if(latest_score[0].scorePlayers[0].playerId == user._id){
			    latest_score_player_index = 0;
			} else {
			    latest_score_player_index = 1;
			}
			plain_user = user.toObject();
			delete plain_user.local.password;
			calculated_info = {wins:0,losses:0,points:0};
			calculated_info.wins = latest_score[0].scorePlayers[latest_score_player_index].wins;
			calculated_info.losses = latest_score[0].scorePlayers[latest_score_player_index].losses;
			calculated_info.points = latest_score[0].scorePlayers[latest_score_player_index].points;
			res.json({result:{login_info:plain_user,
					  calculated_info:calculated_info,
					  badges:[],
					  settings:{}
					 },
				 error:err})
		    })
		})

	    },
	    addUser: function(req,res,next){
		var challengeuserlogin = new ChallengeUserLogin(req.body);
		challengeuserlogin.local.password = challengeuserlogin.generateHash(challengeuserlogin.local.password) 
		return challengeuserlogin.save(function(err, user){
		    //return challengeuserlogin.save().then(function(err, user){
		    if(report_mongo_error(err, res)){
			return false
		    }
		    res.json({result:user._id,
			     error:err});
		    return true
		})
	    }
	}
    }
    return controllers;
}
