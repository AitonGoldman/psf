
function outputValidationError(err){
    error_message = "VALIDATION ERROR WHILE CREATING NEW SCORE : "
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

module.exports = function(score_type){
    var mongoose = require('mongoose');
    require('../models/ChallengeScore');
    var mPromise = require('mpromise');
    var async = require('async')
    var ChallengeScore = mongoose.model('ChallengeScore');
    var ObjectId = require('mongoose').Types.ObjectId; 
    controllers = {};
    if(score_type == 'challenge'){
	controllers = {
	    addScore: function(req,res,next){
		var challengescore = new ChallengeScore(req.body);
		return challengescore.save(function(err, score){
		    if(err){
			res.status(400).send({result: false,
					      error: outputValidationError(err)
					     })
			return false
		    }
		    res.json({result:true,
			      error:err});
		    return true
		})
	    },
	    getScoreForTwoPlayers: function(req,res,next){
		var useridobj;
		var useridobj2;
		if(req.params.userid === undefined || req.params.userid2 === undefined){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    
		}
		try {
		    useridobj = new ObjectId(req.params.userid);
		    useridobj2 = new ObjectId(req.params.userid2);
		} catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    
		}
		
		var promise1;
		var promise2;
		var results = {}
		promise1 = ChallengeScore.find().where('scorePlayers.playerId').in(useridobj).sort('-dateOfScore').limit(1).exec();
		promise2 = ChallengeScore.find().where('scorePlayers.playerId').in(useridobj2).sort('-dateOfScore').limit(1).exec();
		promise = new mPromise;
		promise1.addBack(function(err,data){
		    results.score1 = data;
		    if(results.score2){
			res.json({results:results});
			promise.fulfill()
		    }
		})

		promise2.addBack(function(err,data){
		    results.score2 = data;
		    if(results.score1){
			res.json({results:results});
			promise.fulfill()
		    }
		})
		return promise;
	    },
	    getScore: function(req,res,next){
		var useridobj;
		if(req.params.userid === undefined){
		    req.params.userid='poop';
		}
		try { 
		    useridobj = new ObjectId(req.params.userid)		    
		} catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    		    
		}
	    	return ChallengeScore.find().where('scorePlayers.playerId').in(useridobj).sort('-dateOfScore').limit(1).exec(function(err,latest_score){
		    if(err){
			report_general_error("Query Error","Invalid player id", res) 
			return false;
		    }
		    res.json({result:latest_score[0],
			      error:err});
		    return true
		})
	    },
	    getScores: function(req,res,next){
		var useridobj;
		if(req.params.userid === undefined){
		    req.params.userid='poop';
		}
		try { 
		    useridobj = new ObjectId(req.params.userid)
		} catch(err){
		    report_general_error("Invalid Parameter","Invalid userid",res)
		    return Promise.reject({})		    	   
		}
	    	return ChallengeScore.find().where('scorePlayers.playerId').in(useridobj).sort('-dateOfScore').exec(function(err,latest_score){
		    if(err){
			report_general_error("Query Error","Invalid player id", res) 
			return false;
		    }
		    res.json({result:latest_score,
			      error:err});
		    return true
		})
	    }
	}
    }
    return controllers;
}
