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

function get_calculated_score_info(userid_to_check, latest_score_to_check){
    var calculated_info = {wins:0,losses:0,points:0};
    var latest_score_player_index;
    if(latest_score_to_check.length > 0){			
 	if(latest_score_to_check[0].scorePlayers[0].playerId == userid_to_check){
	    latest_score_player_index = 0;
	} else {
	    latest_score_player_index = 1;
	}
	calculated_info.wins = latest_score_to_check[0].scorePlayers[latest_score_player_index].wins;
	calculated_info.losses = latest_score_to_check[0].scorePlayers[latest_score_player_index].losses;
	calculated_info.points = latest_score_to_check[0].scorePlayers[latest_score_player_index].points
    }
    return calculated_info;
}

module.exports = function(login_type){
    var mongoose = require('mongoose');
    require('../models/ChallengeUserLogin');
    require('../models/ChallengeScore');
    var mPromise = require('mpromise');
    var ChallengeUserLogin = mongoose.model('ChallengeUserLogin');
    var ChallengeScore = mongoose.model('ChallengeScore');    
    var ObjectId = require('mongoose').Types.ObjectId; 

    controllers = {};
    if(login_type == 'local'){
	controllers = {
	    updateUserEmail: function(req,res,next){		
		var userid;
		if(req.params.userid === undefined){
		    req.params.userid='poop';
		}
		try{
		    var userid = new ObjectId(req.params.userid)
		}catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    	   
		}
		new_email = req.body.email;
		if(new_email === undefined){
		    report_general_error("Invalid Parameter","Invalid email",res)
		    return Promise.reject({})
		}
		return ChallengeUserLogin.update({_id:userid},{'local.email':new_email},{runValidators: true}).exec(function(err, data){
		    if(report_mongo_error(err, res)){
			return false
		    }

		    if(data.n > 0){
		     	res.json({result:true,
		      		  error: err});
		     	return true;
		    } else {
		     	report_general_error("DB error","No docs changed",res)
		     	return false
		    }
		})
	    },
	    updateUserDisplayName: function(req,res,next){
		var userid;
		if(req.params.userid === undefined){
		    req.params.userid='poop';
		}
		try{
		    var userid = new ObjectId(req.params.userid)
		}catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    	   
		}
		new_displayname = req.body.displayName;
		if(new_displayname === undefined){
		    report_general_error("Invalid Parameter","Invalid display name",res)
		    return Promise.reject({})
		}
		return ChallengeUserLogin.update({_id:userid},{'displayName':new_displayname}, {runValidators: true}).exec(function(err, data){
		    if(report_mongo_error(err, res)){
		      	return false
		     }

		    if(data.n > 0){
		     	res.json({result:true,
		      		  error: err});
		     	return true;
		     } else {
		     	report_general_error("DB error","No docs changed",res)
		     	return false
		     }
		});
	    },
	    getUserInfo: function(req,res,next){
		//fixme : pull our objectid creation
		var userid;
		promise = new mPromise;
		var promise1;
		var promise2;
		var results = {};
		if(req.params.userid === undefined){
		    if(req.isAuthenticated()){
			req.params.userid = req.user._id
		    } else {
			report_general_error("Invalid Parameter","Invalid userid",res)
			return Promise.reject({})		    	   
		    }

		}
		try{
		    var userid = new ObjectId(req.params.userid)
		}catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    	   
		}
		
		promise1 = ChallengeScore.find().where('scorePlayers.playerId').in(userid).sort('-dateOfScore').limit(1).exec(function(err,latest_score){
		    if(err){
			report_general_error("DB error",err,res)
			return false;
		    }
		    if(latest_score.length > 0){			
			results.score = get_calculated_score_info(userid, latest_score)

		    } else {
			results.score = {}
		    }
		})

		promise1.addBack(function(err,data){
		    if(results.user){
			res.json({results:results});
			promise.fulfill();
		    }
		})

		promise2 = ChallengeUserLogin.find({_id:userid}).exec(function(err, user){
		    var latest_score_player_index = -1;
		    //fixme : need to handle empty results better ( i.e. no matches played yet )
		    if(user == null){
		     	report_general_error("Invalid Parameter","Invalid userid",res)
 			return false		    	   
		    }
		    plain_user = user[0].toObject();
		    delete plain_user.local.password;
		    results.user = plain_user;
		});
		promise2.addBack(function(err,data){
		    if(results.score){
			res.json({results:results});
			promise.fulfill();
		    }
		})		
		return promise;
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
